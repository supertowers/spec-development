# Brownfield Adoption

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Created** | 2026-10-08 |
| **Author** | Pablo López Torres |

---

## Overview

The [traceability protocol](./TRACEABILITY.md) is easy to follow from the first commit. Most projects adopt it later, with a codebase that already holds months of behavior, some of it specified, some of it implied, and some of it invented along the way by people or agents.

This document describes how to bring such a codebase under the protocol without stopping feature work, and without laundering unplanned behavior into the specs.

### Core Principle

> **Stop the bleeding first, then pay down the debt. Writing a spec from existing code is an act of review, not transcription.**

---

## Phase 0 — Stop the Bleeding (day 1)

Goal: from today on, no new unspecified behavior enters the codebase.

1. Copy `tools/spec-check.mjs` into the project and write `spec-check.config.json`. Declare the real surface patterns of the project: tool definitions, routes, CLI commands, exported API.
2. Generate the initial baseline. This is the only time `--allow-grow` is expected:

   ```bash
   node tools/spec-check.mjs --update-baseline --allow-grow
   ```

3. Add `spec-check` to CI as a required check. From now on, any new orphan file, unannotated entry point or dangling ID fails the build.
4. Add the [rules for agents](./TRACEABILITY.md#5-rules-for-agents) to the project's agent instructions.
5. Record the starting baseline size. It is the debt to pay down.

The codebase is not specified yet, but it can no longer get worse.

---

## Phase 1 — Separate Specs from Other Documents

Existing `docs/specs/` folders usually mix several kinds of document. Only one kind is a spec.

| Kind | Purpose | Where it goes |
|------|---------|---------------|
| **Spec** | What the system must do. A contract. | `docs/specs/` with frontmatter |
| **Design doc / RFC** | How and why we chose an approach | `docs/design/` |
| **Plan / roadmap** | What we intend to build and when | `docs/plans/` |
| **Progress log** | What was done | Worklog or changelog |

Move every non-spec out of `docs/specs/`. `spec-check` reports what is left as W101 until it gets frontmatter.

Requirement IDs that already appear in code in a non-scoped form, such as `REQ-7`, are migrated to scoped IDs during Phase 3, when their spec is written.

---

## Phase 2 — Draw the Spec Map

Before writing any spec, decide **which specs will exist** and **which code each owns**.

1. List the source tree by domain. Packages, modules, apps.
2. Propose one spec per cohesive capability. Rules of thumb:
   - A spec owns a capability, not a file. One spec may cover several directories.
   - A spec should fit in one reading: roughly 5 to 25 requirements.
   - Units that share a shape, such as plugins, integrations or apps in a catalog, each get their own spec built from a **shared family template**. The family template defines the requirements every member must state, for example authentication, the tool list and error behavior.
3. Assign each spec a key and its `covers` globs.
4. **A human approves the map.** It fixes the vocabulary for everything that follows.

Record the map in `docs/specs/README.md`, the specs index.

---

## Phase 3 — Reverse-Spec, One Capability at a Time

For each spec in the map, in priority order:

### 3.1 Draft as-built

An agent reads the owned code and drafts the spec **describing what the code actually does**, using the standard template. Status `draft`.

The draft has one extra section, removed before approval:

```markdown
## As-Built Review

Behaviors found in the code that have no known rationale. Each needs a decision.

| # | Behavior | Evidence | Keep? |
|---|----------|----------|-------|
| 1 | Retries upstream calls 3 times on any error | `src/client.ts:88` | ☐ Keep as REQ ☐ Remove |
| 2 | Accepts undocumented `debug` parameter | `src/tools/search.ts:21` | ☐ Keep as REQ ☐ Remove |
```

The agent must put a behavior in this table, rather than in Requirements, whenever it cannot point to a reason for it: an issue, a design doc, a commit message, a user request. When in doubt, it goes in the table.

### 3.2 Review and approve

A human goes through the As-Built Review table and decides each row. "Keep" rows become requirements. "Remove" rows become tasks. Then the human approves the spec.

This is where hallucinated features from the past are caught. Do not skip it, and do not let the drafting agent pre-tick the boxes.

### 3.3 Link

- Add `@spec` annotations to the surface items the spec owns.
- Rename or add tests so each AC is cited by at least one test.
- Replace any legacy unscoped IDs in comments with the new scoped IDs.
- Delete the code marked "Remove", with its tests.

### 3.4 Close

- Run `spec-check`. The violations for this spec's files disappear.
- Run `--update-baseline` to lock in the smaller baseline.
- Set the spec status to `implemented`.

### Priority order

1. Code that changes most often, from `git log`, since that is where drift accumulates fastest.
2. Core libraries and protocols other code depends on.
3. Code with external side effects: payments, writes to third-party systems, deletions.
4. Everything else.

---

## Phase 4 — First Full Audit

When the baseline reaches zero, run a [Spec Audit](./SPEC-AUDIT.md) over every spec. The reverse-spec drafts were written by reading the code, so they tend to agree with it. The audit checks that they also agree with what the humans decided.

From then on, the scheduled audit takes over.

---

## Tracking Progress

Keep a short table in the specs index:

| Date | Baseline | Specs implemented / total | Notes |
|------|----------|---------------------------|-------|

---

## Related Documents

- [TRACEABILITY.md](./TRACEABILITY.md)
- [SPEC-AUDIT.md](./SPEC-AUDIT.md)
- [SPEC-FORMAT.md](./SPEC-FORMAT.md)

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-10-08 | Initial version | Pablo López Torres |
