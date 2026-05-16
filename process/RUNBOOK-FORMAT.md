# Runbook Format

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Author** | Pablo López Torres / Alice Evergreen |

---

## What is a Runbook?

A runbook documents a **specific procedure** that was executed or needs to be executed: a migration, a fix, a refactor, a deployment. It is a living document that captures the steps, decisions, and outcomes of a concrete change to a system.

Runbooks are different from specs:
- **Spec**: defines *what* a feature should do (future-oriented, requirements)
- **Runbook**: documents *how* a specific change was made (past/present-oriented, procedure)

---

## When to Write a Runbook

Write a runbook for:
- Database migrations
- Infrastructure changes
- Multi-step bug fixes that require coordination
- Refactors that touch many files
- One-time data cleanup operations
- Deployment procedures for new services
- Any change where the sequence of steps matters

Do NOT write a runbook for:
- Routine feature development (use the SDD workflow instead)
- Minor bug fixes that are self-contained in a PR
- Configuration changes that are fully reversible

---

## File Naming Convention

```
YYYYMMDD_description-in-kebab-case.md
```

**Examples:**
```
20260322_migrate-users-to-new-schema.md
20260415_fix-payment-webhook-handler.md
20260501_deploy-search-service.md
```

**Location:** `/docs/runbooks/`

---

## Runbook Template

```markdown
# [Short Title of the Change]

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Author** | name |
| **Status** | Draft / In Progress / Done / Rolled Back |
| **Risk** | Low / Medium / High |
| **Reversible** | Yes / No / Partial |

---

## Summary

One paragraph: what is this runbook for? What problem does it solve?

---

## Context

Why is this change needed? What is the current state and what is the desired state?

Include relevant background:
- What triggered this?
- What are the risks if we don't do it?
- Are there dependencies on other changes?

---

## Pre-conditions

What must be true before executing this runbook:

- [ ] Condition 1 (e.g. backup completed)
- [ ] Condition 2 (e.g. feature flag disabled)
- [ ] Condition 3 (e.g. maintenance window active)

---

## Steps

### Step 1 — [Action Name]

**What**: Description of what this step does
**Why**: Why this step is necessary
**Risk**: What could go wrong

```bash
# Commands to execute
command --flag value
```

**Expected output:**
```
Expected result here
```

**Verification:**
```bash
# How to verify this step succeeded
```

---

### Step 2 — [Action Name]

[Same structure as Step 1]

---

## Rollback Procedure

If something goes wrong, how do we revert?

### Step R1 — [Rollback Action]

```bash
# Rollback commands
```

---

## Verification

After all steps are complete, verify the system is in the correct state:

- [ ] Check 1: description + command
- [ ] Check 2: description + command
- [ ] Check 3: description + command

---

## Notes & Decisions

Document any decisions made during execution, unexpected findings, or deviations from the plan:

| Decision | Reason | Impact |
|----------|--------|--------|
| ... | ... | ... |

---

## Outcome

**Status after execution:** [Completed / Partially completed / Rolled back]

**Summary of what happened:**

**Issues encountered:**

**Follow-up actions:**
- [ ] Action 1
- [ ] Action 2
```

---

## Writing Style

### Be Specific About Commands

Always include the exact commands to run. Do not write "run the migration script" — write the full command with all flags.

```bash
# ❌ Too vague
Run the migration

# ✅ Specific
node scripts/migrate.js --env production --dry-run
node scripts/migrate.js --env production --confirm
```

### Document Expected Outputs

After every significant command, document what the expected output looks like. This allows the executor to verify success without guessing.

### Mark Irreversible Steps Clearly

If a step cannot be undone, mark it explicitly:

```markdown
### Step 3 — Delete old records ⚠️ IRREVERSIBLE

**This step cannot be undone.** Ensure backup from Step 1 is complete before proceeding.
```

### Record Actual Outcomes

After execution, update the runbook with what actually happened. The runbook is a living document, not just a plan.

---

## Risk Levels

| Level | Meaning |
|-------|---------|
| **Low** | Fully reversible, no data loss risk, affects only non-critical systems |
| **Medium** | Partially reversible or affects important systems; requires testing first |
| **High** | Irreversible or affects production data; requires approval and backup |

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-05-16 | Initial version | Pablo López Torres |
