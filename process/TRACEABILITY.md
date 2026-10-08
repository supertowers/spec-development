# Traceability Protocol

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Created** | 2026-10-08 |
| **Author** | Pablo López Torres |

---

## Overview

The [SDD workflow](./SPEC-DRIVEN-WORKFLOW.md) guarantees the **forward** direction: every spec produces tests and code. On its own it does not guarantee the **reverse** direction: that every line of shipped code exists because a spec asked for it.

The reverse direction matters most when code is written by AI agents. An agent can add a helpful-looking flag, endpoint, retry policy or fallback that nobody asked for. Tests pass, review misses it, and the spec silently stops describing the system. This document defines how we make that impossible to miss.

### Core Principle

> **No ID, no code. Every behavior in the codebase traces to an approved requirement ID, and every approved requirement ID traces to code and tests.**

### The two directions

```
                FORWARD  (spec → code)                    REVERSE  (code → spec)
   ┌──────────┐  "is every requirement built?"  ┌──────────┐  "was every behavior asked for?"
   │   SPEC   │ ───────────────────────────────▶│   CODE   │ ─────────────────────────────────┐
   │ REQ / AC │◀─────────────────────────────── │ + TESTS  │                                  │
   └──────────┘     @spec annotations,          └──────────┘                                  │
        ▲           test titles, covers globs                                                 │
        └─────────────────────────────────────────────────────────────────────────────────────┘
```

| Question | Direction | Checked by |
|----------|-----------|------------|
| Does every approved REQ have code? | Forward | `spec-check` E011 |
| Does every approved AC have a test? | Forward | `spec-check` E010 |
| Is every source file owned by a spec? | Reverse | `spec-check` E008 |
| Is every public entry point linked to a REQ? | Reverse | `spec-check` E009 |
| Does the code do what the REQ says, and nothing more? | Both | [Spec Audit](./SPEC-AUDIT.md) |

The first four are **structural** and run in CI on every change. The last one is **semantic** and runs periodically, because only a reader can tell whether code matches prose.

---

## 1. Requirement IDs

### Format

Every requirement, non-functional requirement and acceptance criterion has a globally unique ID:

```
{SPEC-KEY}-{KIND}-{N}

INV-REQ-3     functional requirement 3 of the INV spec
INV-NFR-1     non-functional requirement 1 of the INV spec
INV-AC-7      acceptance criterion 7 of the INV spec
```

| Part | Rule |
|------|------|
| `SPEC-KEY` | 2–16 uppercase letters or digits, starting with a letter. Declared once in the spec frontmatter `id`. Unique across the project. |
| `KIND` | `REQ`, `NFR` or `AC` |
| `N` | Positive integer. Assigned sequentially within the spec. |

Bare IDs such as `REQ-7` are **forbidden**. They are ambiguous the moment a second spec exists.

### Definition

An ID is **defined** where it appears in bold in its own spec: `**INV-REQ-3**`. Anywhere else, a plain mention is a **reference**.

### Stability rules

1. **IDs are never renumbered.** Inserting a requirement takes the next free number, even if it reads out of order.
2. **IDs are never reused.** A removed requirement is moved to the `retired` list in the frontmatter. Its number is gone forever.
3. **Changing meaning means a new ID.** If a requirement changes what it promises, not just how it is worded, retire the old ID and define a new one. Code that referenced the old ID then fails the check and must be revisited, which is exactly the point.

---

## 2. Spec Frontmatter

Every spec starts with a YAML frontmatter block. It is the machine-readable part of the spec.

```yaml
---
id: INV                    # spec key, prefix of every ID in this spec
title: Invoices
status: approved           # draft | approved | implemented | deprecated
version: 1.2.0
owners: [pablo]
depends_on: [AUTH, LEDGER]
covers:                    # code this spec owns; required once status leaves draft
  - packages/billing/src/invoices/**
  - apps/billing-api/src/routes/invoices.ts
retired: [INV-REQ-4]       # IDs removed from this spec, never to be reused
---
```

### Status lifecycle

```
 draft ──(human approval)──▶ approved ──(all checks green)──▶ implemented ──▶ deprecated
   ▲                             │
   └──── material change ────────┘
```

| Status | Meaning | What the checker enforces |
|--------|---------|---------------------------|
| `draft` | Being written. Not a contract yet. | Code and tests **must not** reference it (E007). Its `covers` does not count. |
| `approved` | A human signed it off. Work may start. | Its `covers` owns files. References are allowed. |
| `implemented` | Built and verified. | Every REQ has a code reference (E011). Every AC has a test (E010). |
| `deprecated` | Scheduled for removal. | References produce a warning (W102). |

**Only a human moves a spec from `draft` to `approved`.** An agent may draft, but approval is recorded in the spec changelog with the approver's name. This is the single most important control against hallucinated scope: an agent cannot authorize its own work.

---

## 3. Linking Code to Specs

Three mechanisms, from coarse to fine.

### 3.1 Ownership: `covers`

Every source file must be matched by the `covers` globs of at least one non-draft spec. A file nobody owns is **orphan code** (E008).

Files that genuinely have no behavior, such as barrel re-exports or generated types, go in the `exempt` list of `spec-check.config.json`, each with a written reason. The exempt list is reviewed in every audit.

### 3.2 Surface annotations: `@spec`

Ownership is too coarse to catch a hallucinated feature inside an owned file. So every **public surface item** must carry an annotation naming the requirement it implements:

```ts
/**
 * Creates an invoice from line items.
 * @spec INV-REQ-1
 */
export function createInvoice(items: LineItem[]): Invoice { … }
```

A **surface item** is any way the outside world can reach behavior. Each project declares its surface patterns in `spec-check.config.json`. Typical surfaces:

| Project type | Surface items |
|--------------|---------------|
| Library | Exported functions and classes from the public entry point |
| HTTP service | Route registrations |
| CLI | Commands, subcommands and flags |
| Agent / plugin platform | Tool definitions, event handlers, hooks |
| Protocol | Message types |
| UI | Routes / screens |

An item may list several IDs: `@spec INV-REQ-1, INV-REQ-2`. Only `REQ` and `NFR` IDs satisfy a surface annotation.

Internal helpers do not need annotations. They are covered by their file's owner and by the semantic audit.

### 3.3 Test links: AC IDs in test names

Every test that verifies an acceptance criterion names it in its title:

```ts
it('[INV-AC-1] sums the line items into the invoice total', …)
```

```gherkin
Scenario: Invoice total is the sum of its line items   # INV-AC-1
```

A test with no AC ID is allowed. It is a unit or regression test. A test citing an ID that does not exist is an error (E005).

---

## 4. The Deterministic Check (`spec-check`)

`tools/spec-check.mjs` is a zero-dependency Node script that enforces sections 1–3. Copy it into the project, add a config, and run it in CI.

### Config

`spec-check.config.json` at the project root:

```json
{
  "specs": "docs/specs",
  "sources": ["packages/*/src/**/*.ts"],
  "tests": ["packages/*/test/**/*.test.ts"],
  "exclude": ["**/dist/**", "**/*.d.ts"],
  "exempt": [
    { "path": "packages/*/src/index.ts", "reason": "barrel re-exports, no behavior" }
  ],
  "surfaces": [
    { "name": "exported function", "files": ["packages/*/src/**/*.ts"],
      "pattern": "^export (?:async )?function (\\w+)", "window": 12 }
  ],
  "baseline": "spec-check.baseline.json"
}
```

`pattern` is a multiline regular expression. Capture group 1, if present, names the item in reports. `window` is how many lines above the match may hold the `@spec` tag.

### Checks

| Code | Severity | Rule |
|------|----------|------|
| E001 | Error | Spec frontmatter is missing or invalid |
| E002 | Error | Two specs declare the same key |
| E003 | Error | An ID is defined twice, or both defined and retired |
| E004 | Error | An ID's prefix does not match the spec defining it |
| E005 | Error | A reference names an ID that no spec defines |
| E006 | Error | Code or a test references a retired ID |
| E007 | Error | Code or a test references a draft spec |
| E008 | Error | A source file is owned by no spec (orphan code) |
| E009 | Error | A public surface item has no `@spec` annotation |
| E010 | Error | An AC of an implemented spec has no test |
| E011 | Error | A REQ of an implemented spec has no code reference |
| E012 | Error | Code or a test uses an unscoped ID such as `REQ-7` |
| W101 | Warning | A markdown file in the specs directory has no frontmatter |
| W102 | Warning | Code references a deprecated spec |
| W103 | Warning | A `covers` glob matches no file |

### Commands

```bash
node tools/spec-check.mjs                          # check; exit 1 on new errors
node tools/spec-check.mjs --json                   # machine-readable output
node tools/spec-check.mjs --matrix docs/specs/_generated/matrix.md   # traceability matrix
node tools/spec-check.mjs --update-baseline        # ratchet the baseline down
```

### Baseline ratchet

An existing codebase will start with hundreds of violations. The baseline file lists the ones that are already known, so CI only fails on **new** violations.

- The baseline may only **shrink**. `--update-baseline` refuses to add entries unless `--allow-grow` is passed, and that requires a written justification in the commit message.
- When violations are fixed, the checker says so. Update the baseline in the same change to lock in the progress.
- Track the baseline size over time. It is the single number that says how far the codebase is from being fully specified.

See [BROWNFIELD-ADOPTION.md](./BROWNFIELD-ADOPTION.md) for how to drive it to zero.

---

## 5. Rules for Agents

These rules go verbatim into the project's agent instructions (`CLAUDE.md`, `AGENTS.md` or equivalent).

1. **Before writing code, name the requirement IDs you are implementing.** If you cannot, stop. The work is not specified.
2. **Only reference specs whose status is `approved` or `implemented`.** Never implement against a draft.
3. **Never edit a spec to match the code you just wrote.** If the spec is wrong or incomplete, report it to the Spec Agent or the human with the exact gap. Spec changes and code changes for the same requirement are never made by the same agent in the same step.
4. **Never add behavior that no requirement asks for.** This includes "helpful" extras: fallbacks, retries, extra flags, extra fields, convenience endpoints, silent defaults. If it seems necessary, propose a requirement.
5. **Annotate every new public surface item with `@spec`.** Name every new acceptance test after its AC.
6. **Never add entries to the `spec-check` baseline or the exempt list** without explicit human instruction.
7. **Run `spec-check` before declaring work complete.** New violations mean the work is not complete.

---

## 6. Change Protocol

Every change to the system is one of four kinds. Each has a fixed order of operations.

| Change | Order |
|--------|-------|
| **New behavior** | Spec draft → human approval → tests → code → `implemented` |
| **Changed behavior** | Retire old ID + define new ID in spec → approval → update tests → update code |
| **Removed behavior** | Retire ID in spec → approval → delete tests → delete code |
| **No behavior change** (refactor, perf, deps) | Code only. `spec-check` must stay green; annotations move with the code. |

Every pull request description includes a **Specs** line:

```
Specs: INV-REQ-5 (new), INV-REQ-2 → INV-REQ-6 (changed), INV-REQ-4 (retired)
```

or, for a refactor:

```
Specs: none (no behavior change)
```

A reviewer who sees new behavior in the diff that is not in that line has found drift.

---

## Related Documents

- [SPEC-AUDIT.md](./SPEC-AUDIT.md) — The periodic semantic check
- [BROWNFIELD-ADOPTION.md](./BROWNFIELD-ADOPTION.md) — Applying this protocol to an existing codebase
- [SPEC-FORMAT.md](./SPEC-FORMAT.md) — Spec structure and frontmatter
- [SPEC-DRIVEN-WORKFLOW.md](./SPEC-DRIVEN-WORKFLOW.md) — The phases this protocol plugs into

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-10-08 | Initial version — scoped IDs, frontmatter, `@spec` annotations, `spec-check`, baseline ratchet | Pablo López Torres |
