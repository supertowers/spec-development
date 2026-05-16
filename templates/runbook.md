# {{SHORT_TITLE}}

<!-- Template — for format rules and writing guidance see: process/RUNBOOK-FORMAT.md -->

| Field | Value |
|-------|-------|
| **Date** | {{YYYY-MM-DD}} |
| **Author** | {{AUTHOR}} |
| **Status** | Draft |
| **Risk** | {{Low / Medium / High}} |
| **Reversible** | {{Yes / No / Partial}} |

---

## Summary

{{One paragraph: what is this runbook for? What problem does it solve?}}

---

## Context

{{Why is this change needed? What is the current state and what is the desired state?}}

---

## Pre-conditions

- [ ] {{Condition 1 (e.g. backup completed)}}
- [ ] {{Condition 2}}

---

## Steps

### Step 1 — {{Action Name}}

**What**: {{Description}}
**Why**: {{Reason}}
**Risk**: {{What could go wrong}}

```bash
# {{Commands to execute}}
```

**Expected output:**
```
{{Expected result here}}
```

**Verification:**
```bash
# {{How to verify this step succeeded}}
```

---

### Step 2 — {{Action Name}}

...

---

## Rollback Procedure

### Step R1 — {{Rollback Action}}

```bash
# {{Rollback commands}}
```

---

## Verification

- [ ] {{Check 1: description}}
- [ ] {{Check 2: description}}

---

## Notes & Decisions

| Decision | Reason | Impact |
|----------|--------|--------|
| ... | ... | ... |

---

## Outcome

**Status after execution:** {{Completed / Partially completed / Rolled back}}

**Summary of what happened:** {{Description}}

**Issues encountered:** {{Description or "None"}}

**Follow-up actions:**
- [ ] {{Action 1}}
