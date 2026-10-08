# Spec Audit Protocol

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Created** | 2026-10-08 |
| **Author** | Pablo López Torres |

---

## Overview

[`spec-check`](./TRACEABILITY.md#4-the-deterministic-check-spec-check) proves that links exist: every file has an owner, every entry point names a requirement, every AC has a test. It cannot prove that the links are **true**. A function annotated `@spec INV-REQ-1` may do what INV-REQ-1 says, half of it, something else, or INV-REQ-1 plus three things nobody asked for.

The Spec Audit is the periodic semantic check that closes that gap. A reader, usually an agent, compares each spec with the code it owns, in both directions, and reports every mismatch for a human to resolve.

### Core Principle

> **The auditor reports. The human decides. Drift is never resolved by quietly rewriting the spec to match the code.**

---

## When to Audit

| Trigger | Scope |
|---------|-------|
| **Scheduled**, weekly | Every spec whose covered files changed since its last audit, plus the oldest-audited specs until the time budget is spent |
| **Before a release** | Every spec touched since the previous release |
| **After a large agent-driven change** | The specs owning the changed files |
| **When `spec-check` exemptions or baseline grow** | The exempted files |

Every spec must be audited at least once per **audit horizon**, four weeks by default. The audit log makes that visible.

---

## Who Audits

The **Audit Agent** (see [AGENT-ROLES.md](./AGENT-ROLES.md#agent-5-audit-agent)). It is the only role that reads both specs and source code with the explicit goal of finding disagreement between them.

Independence rules:

1. The auditor **did not write** the spec or the code under audit in the same session.
2. The auditor receives **the spec, the traceability matrix and the file list**. It does not receive the PR description, the author's reasoning or a previous verdict. An auditor handed a conclusion tends to confirm it.
3. The auditor is **read-only**. It never edits code, tests or specs.
4. Every finding is **verified** by a second, independent pass before it reaches the report. The verifier's job is to refute the finding.

---

## Procedure

Run once per spec in scope.

### Step 0 — Prepare

```bash
node tools/spec-check.mjs --matrix docs/specs/_generated/matrix.md
git log --since="<last audit date>" --name-only -- <covers globs>
```

Collect for the spec: its text, its matrix rows, every file matched by its `covers`, and the tests that cite its ACs.

### Step 1 — Forward pass: is every requirement built as written?

For each `REQ` and `NFR`, find the code that realizes it, starting from the `@spec` references, and assign one verdict:

| Verdict | Meaning |
|---------|---------|
| `OK` | The code does what the requirement says, including its MUST NOT clauses |
| `PARTIAL` | Some clauses are implemented, others are not |
| `DIVERGENT` | The code does something different from what the requirement says |
| `MISSING` | No code realizes the requirement, despite any annotation |
| `MISLINKED` | An `@spec` annotation points at a requirement the code does not implement |

### Step 2 — Reverse pass: was every behavior asked for?

This is the pass that catches hallucinated features. Read every covered file and **enumerate observable behaviors**, not functions. Look specifically for:

- Inputs accepted: parameters, flags, config keys, environment variables, headers
- Outputs produced: fields returned, events emitted, files written, messages logged at user-visible levels
- Side effects: network calls, writes, deletions, caches, retries, background jobs
- Decisions: branches that change outcome, defaults applied when input is absent, fallbacks taken on error
- Limits: timeouts, size caps, rate limits, pagination sizes

Map each behavior to a requirement. A behavior with no requirement is `UNSPECIFIED`.

Pay extra attention to the shapes agents most often invent:

| Pattern | Example |
|---------|---------|
| Silent fallback | Returns an empty list when the upstream call fails |
| Invented default | Uses `limit = 50` when the spec says nothing about limits |
| Bonus option | Adds a `--force` flag "for convenience" |
| Over-broad input | Accepts a field the spec does not define and passes it through |
| Speculative retry | Retries three times with backoff on any error |
| Shadow feature | A whole helper path reachable only through an undocumented argument |

### Step 3 — Test pass: do the tests prove the ACs?

For each AC, read the tests that cite it.

| Verdict | Meaning |
|---------|---------|
| `OK` | The test would fail if the AC were violated |
| `HOLLOW` | The test cites the AC but does not assert the AC's observable outcome |
| `MISCITED` | The test verifies something else |

### Step 4 — Spec pass: is the spec itself still sound?

| Verdict | Meaning |
|---------|---------|
| `AMBIGUOUS` | Two reasonable readings lead to different code |
| `STALE` | The spec describes a world that no longer exists, such as a removed dependency |
| `CONFLICT` | The spec contradicts another spec |

### Step 5 — Verify

Hand each finding, with its evidence and nothing else, to a fresh verifier. The verifier answers `CONFIRMED`, `REFUTED` or `UNCERTAIN` with a reason. Only `CONFIRMED` and `UNCERTAIN` findings go in the report, and `UNCERTAIN` ones are marked as such.

---

## Report

One file per audit run: `docs/specs/_audits/YYYY-MM-DD.md`. The underscore keeps it out of `spec-check`'s spec scan.

```markdown
# Spec Audit — 2026-10-08

| Field | Value |
|-------|-------|
| **Specs audited** | INV, AUTH, LEDGER |
| **Auditor** | Audit Agent (model, version) |
| **Commit** | abc1234 |
| **spec-check baseline** | 212 (previous: 230) |

## Summary

| Category | Count |
|----------|-------|
| UNSPECIFIED | 3 |
| DIVERGENT | 1 |
| MISSING | 0 |
| PARTIAL | 1 |
| HOLLOW | 2 |
| AMBIGUOUS / STALE / CONFLICT | 1 |

## Findings

### F-1 · UNSPECIFIED · INV
- **Evidence**: `src/invoices/create.ts:48` retries the tax lookup three times with backoff.
- **No requirement** covers retry behavior for tax lookup.
- **Verification**: CONFIRMED — retry loop is reachable on every call.
- **Decision**: ☐ Adopt (write requirement) ☐ Remove (delete code)
- **Decided by**: —

### F-2 · DIVERGENT · INV-REQ-2
- **Evidence**: requirement says newest first; `src/invoices/list.ts:12` sorts by id ascending.
- **Verification**: CONFIRMED.
- **Decision**: ☐ Fix code ☐ Change spec
- **Decided by**: —
```

---

## Resolution

Each finding gets exactly one decision, made and signed by a human.

| Finding | Allowed decisions | What happens next |
|---------|-------------------|-------------------|
| `UNSPECIFIED` | **Adopt** or **Remove** | Adopt: new requirement, approved, then annotation and test. Remove: delete the code and anything only it used. |
| `DIVERGENT` | **Fix code** or **Change spec** | Change spec retires the old ID and defines a new one. |
| `MISSING`, `PARTIAL` | **Build** or **Retire requirement** | Normal change protocol. |
| `MISLINKED` | **Fix annotation** | Trivial change; no spec change. |
| `HOLLOW`, `MISCITED` | **Fix test** | QA Agent rewrites the test. |
| `AMBIGUOUS`, `STALE`, `CONFLICT` | **Clarify spec** | Spec Agent proposes, human approves. |

"Adopt" is never the default. The question is not "is this code useful?" but "did we decide we want this behavior?". If nobody can say yes, remove it.

Follow-up work goes through the [change protocol](./TRACEABILITY.md#6-change-protocol). The audit closes when every finding has a decision.

---

## Metrics

Append one row per run to `docs/specs/_audits/README.md`:

| Date | Specs | UNSPECIFIED | DIVERGENT | MISSING + PARTIAL | HOLLOW | Spec issues | Baseline |
|------|-------|-------------|-----------|-------------------|--------|-------------|----------|

Healthy trends:

- `UNSPECIFIED` trends to zero. A steady stream means agents are being given too much freedom, or specs are too thin to constrain them. Tighten the [rules for agents](./TRACEABILITY.md#5-rules-for-agents) or the spec template.
- `Baseline` decreases monotonically.
- Each spec appears in the log at least once per audit horizon.

These numbers feed [Loop 5](./DEVELOPMENT-LOOPS.md#loop-5--meta-loop-process-improvement).

---

## Automating the Audit

The audit is designed to be run by an agent on a schedule. A ready-made Claude Code subagent lives in [`../agents/spec-auditor.md`](../agents/spec-auditor.md). A typical setup:

1. A scheduled job runs weekly on the default branch.
2. It runs `spec-check --matrix`, selects the specs in scope, and invokes the auditor once per spec.
3. It runs the verification pass on every finding.
4. It opens a pull request adding the report under `docs/specs/_audits/`. The human records decisions in that PR.

---

## Related Documents

- [TRACEABILITY.md](./TRACEABILITY.md) — IDs, annotations and the structural check
- [AGENT-ROLES.md](./AGENT-ROLES.md) — The Audit Agent's boundaries
- [DEVELOPMENT-LOOPS.md](./DEVELOPMENT-LOOPS.md) — Where audit metrics are consumed

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-10-08 | Initial version | Pablo López Torres |
