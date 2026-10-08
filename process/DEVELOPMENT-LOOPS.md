# Development Loops

| Field | Value |
|-------|-------|
| **Version** | 1.1.0 |
| **Status** | Draft |
| **Created** | 2026-07-26 |
| **Author** | Pablo López Torres |

---

## Overview

The SDD workflow is not a straight line — it is a system of **nested loops**. Each loop has a clear entry condition, exit condition, and the agents involved. Understanding these loops is critical for knowing where you are in the process and what needs to happen next.

This document defines five loops, from innermost (fastest) to outermost (slowest):

```
┌─────────────────────────────────────────────────────────────────────────┐
│  LOOP 5 — META (Process Improvement)                                    │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  LOOP 4 — FULL CYCLE (End-to-End Development)                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │  LOOP 3 — REFINEMENT (Cross-Agent Feedback)                 │  │  │
│  │  │  ┌───────────────────────────────────────────────────────┐  │  │  │
│  │  │  │  LOOP 2 — IMPLEMENTATION (Red/Green/Refactor)         │  │  │  │
│  │  │  │  ┌─────────────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  LOOP 1 — SPECIFICATION (Converge on Truth)     │  │  │  │  │
│  │  │  │  └─────────────────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Loop 1 — Specification Loop

**Speed**: Fast (minutes to hours)
**Agents**: Spec Agent + Stakeholder
**Also covers**: UX Agent + Stakeholder (for UI features)

### Purpose

Converge on a clear, coherent, unambiguous specification before any tests or code are written. This loop also includes the UX sub-loop for features with a user interface.

### Flow

```
Stakeholder has a requirement
        │
        ▼
┌───────────────────┐
│  Spec Agent        │
│  analyzes existing │
│  specs for context │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐     ┌──────────────────┐
│  Spec Agent        │────▶│  Stakeholder      │
│  writes/updates    │     │  reviews spec     │
│  spec              │◀────│  gives feedback   │
└────────┬──────────┘     └──────────────────┘
         │                        │
         │            ┌───────────┘
         │            │
         ▼            ▼
    Spec clear?  ──NO──▶  iterate
         │
        YES
         │
         ▼  Has UI?
    ┌────┴────┐
   YES        NO
    │          │
    ▼          │
┌───────────────────┐     ┌──────────────────┐
│  UX Agent          │────▶│  Stakeholder      │
│  user journey +    │     │  reviews UX       │
│  wireframes +      │◀────│  approves or      │
│  prototype         │     │  requests changes │
└────────┬──────────┘     └──────────────────┘
         │                        │
         │            ┌───────────┘
         │            │
         ▼            ▼
    UX approved?  ─NO─▶  iterate
         │
        YES
         │
         └──────┬──────┘
                │
                ▼
          EXIT → Loop 2
```

### Entry Condition

- A stakeholder has a new requirement, change request, or bug report

### Exit Condition

- Spec is written with clear, scoped `KEY-REQ-N` and `KEY-AC-N` IDs
- No conflicts with existing specs (coherence validated)
- UX approved by stakeholder (if applicable)
- All agents agree the spec is unambiguous enough to proceed

### Metrics to Track

| Metric | What it measures | Target |
|--------|-----------------|--------|
| **Iteration count** | How many rounds of feedback before spec is approved | < 3 |
| **Time to approval** | Clock time from first draft to approved spec | < 1 day |
| **Conflict count** | Number of conflicts found with existing specs | 0 (after resolution) |
| **UX iteration count** | Rounds of UX feedback (if applicable) | < 2 |

### Common Failure Modes

- Spec Agent writes without reading existing specs first → conflicts discovered later
- Stakeholder gives vague requirements → many iteration rounds
- UX Agent skips error states → rework in later loops
- No explicit approval gate → ambiguity propagates downstream

---

## Loop 2 — Implementation Loop

**Speed**: Fast (minutes to hours per cycle)
**Agents**: Dev Agent (primarily), QA Agent (for test creation)

### Purpose

The classic Red/Green/Refactor cycle. QA Agent writes acceptance tests, Dev Agent implements until they pass.

### Flow

```
Spec + UX artifacts ready
        │
        ▼
┌───────────────────┐
│  QA Agent          │
│  writes .feature   │
│  files from spec   │
│  + UX artifacts    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Dev Agent         │
│  runs tests        │◀─────────────────┐
│  (should FAIL)     │                   │
└────────┬──────────┘                   │
         │                              │
         ▼                              │
    🔴 RED                              │
         │                              │
         ▼                              │
┌───────────────────┐                   │
│  Dev Agent         │                   │
│  implements code   │                   │
└────────┬──────────┘                   │
         │                              │
         ▼                              │
┌───────────────────┐                   │
│  Run tests again   │                   │
└────────┬──────────┘                   │
         │                              │
    ┌────┴────┐                         │
    │         │                         │
   PASS     FAIL ───────────────────────┘
    │
    ▼
  🟢 GREEN
    │
    ▼
┌───────────────────┐
│  Dev Agent         │
│  refactors         │
│  (tests stay green)│
└────────┬──────────┘
         │
         ▼
  EXIT → Loop 3 check
```

### Entry Condition

- Approved spec exists (Loop 1 complete)
- UX artifacts exist (if applicable)

### Exit Condition

- All acceptance tests pass
- Code is refactored and clean
- No regressions in existing tests

### Metrics to Track

| Metric | What it measures | Target |
|--------|-----------------|--------|
| **Red-to-Green time** | How long until first passing tests | < 4 hours |
| **Test pass rate on first run** | How many tests pass on the first implementation attempt | > 60% |
| **Refactor ratio** | Lines changed during refactor vs. initial implementation | < 30% |
| **Regression count** | Existing tests that broke during implementation | 0 |

### Common Failure Modes

- Dev Agent skips the Red phase (writes code before running tests)
- Dev Agent "fixes" failing tests instead of fixing the code → escalate to Loop 3
- Dev Agent implements features not in the spec → scope creep
- QA Agent writes tests that are too coupled to one specific implementation

---

## Loop 3 — Refinement Loop

**Speed**: Medium (hours to a day)
**Agents**: Dev Agent → Spec Agent → QA Agent → Dev Agent

### Purpose

Handle the inevitable feedback that emerges during implementation: ambiguities in the spec, untestable criteria, edge cases nobody considered. This is the cross-agent feedback loop that keeps the system honest.

### Flow

```
Dev Agent encounters issue during implementation
        │
        ├── Spec is ambiguous
        │       │
        │       ▼
        │   ┌───────────────────┐
        │   │  Dev Agent reports │
        │   │  ambiguity to      │
        │   │  Spec Agent        │
        │   └────────┬──────────┘
        │            │
        │            ▼
        │   ┌───────────────────┐
        │   │  Spec Agent        │
        │   │  clarifies spec    │
        │   │  checks coherence  │
        │   └────────┬──────────┘
        │            │
        │            ▼
        │   ┌───────────────────┐
        │   │  QA Agent updates  │
        │   │  tests if AC       │
        │   │  changed           │
        │   └────────┬──────────┘
        │            │
        │            ▼
        │      Dev Agent resumes
        │      implementation
        │      (re-enter Loop 2)
        │
        ├── Test seems wrong
        │       │
        │       ▼
        │   Dev Agent reports to Spec Agent
        │   (Dev NEVER modifies .feature files)
        │       │
        │       ▼
        │   Spec Agent decides:
        │   ├── Spec is wrong → Spec Agent fixes → QA updates tests
        │   ├── Test is wrong → QA Agent fixes test
        │   └── Implementation is wrong → Dev Agent fixes code
        │
        └── Edge case discovered
                │
                ▼
            Dev Agent reports to Spec Agent
                │
                ▼
            Spec Agent decides if AC needs update
                │
                ▼
            If yes → QA writes new scenario
                │
                ▼
            Dev implements edge case
```

### Entry Condition

- Dev Agent finds an issue during implementation (Loop 2)
- Any of: spec ambiguity, potential test error, undocumented edge case

### Exit Condition

- Spec is clarified and coherent
- Tests are updated to reflect clarified spec
- Dev Agent can proceed with implementation
- Re-enter Loop 2

### Metrics to Track

| Metric | What it measures | Target |
|--------|-----------------|--------|
| **Refinement count per feature** | How many times Loop 3 is triggered per feature | < 2 |
| **Ambiguity type** | Category of issue (vague requirement, missing edge case, conflicting specs) | Track distribution |
| **Resolution time** | Time from ambiguity report to clarified spec | < 2 hours |
| **Spec stability** | % of specs that don't change after entering Loop 2 | > 70% |

### Common Failure Modes

- Dev Agent guesses instead of reporting ambiguity → wrong implementation
- Dev Agent modifies `.feature` files to "fix" failing tests → violation of agent boundaries
- Spec Agent changes spec without notifying QA Agent → tests out of sync
- Loop 3 triggers too often → spec was not clear enough (fix Loop 1)

---

## Loop 4 — Full Development Cycle

**Speed**: Slow (days)
**Agents**: All four agents, sequentially

### Purpose

The complete end-to-end cycle for one feature, from requirement to validated implementation. This is the macro view of how a single feature moves through the system.

### Flow

```
┌───────────────────────────────────────────────────────────────┐
│                     FULL CYCLE                                 │
│                                                                │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐     │
│   │  LOOP 1  │──▶│  LOOP 2  │──▶│  CODE    │──▶│  VALID. │     │
│   │  Spec +  │   │  QA +    │   │  REVIEW  │   │  Spec   │     │
│   │  UX      │   │  Dev     │   │  Dev +   │   │  Agent  │     │
│   │          │   │  (+ L3)  │   │  Spec    │   │         │     │
│   └─────────┘   └─────────┘   └─────────┘   └────┬────┘     │
│                                                    │          │
│                                               ┌────┴────┐    │
│                                              PASS     FAIL   │
│                                               │         │    │
│                                               ▼         ▼    │
│                                            DONE    Re-enter  │
│                                                   Loop 2/3   │
│                                                              │
└───────────────────────────────────────────────────────────────┘
```

### Phases Within the Full Cycle

| Phase | Loop(s) | Agents | Output |
|-------|---------|--------|--------|
| 1A — Specification | Loop 1 | Spec Agent + Stakeholder | `spec.md` |
| 1B — UX Design | Loop 1 | UX Agent + Stakeholder | `ux.md` |
| 1C — UI Prototype | Loop 1 | UX Agent | `prototype.html` |
| 1D — User Review | Loop 1 | Stakeholder | Approval |
| 2 — Acceptance Tests | Loop 2 (entry) | QA Agent | `.feature` |
| 3 — Implementation | Loop 2 + Loop 3 | Dev Agent | Production code |
| 4 — Code Review | — | Dev Agent + Spec Agent | Review report |
| 5 — Validation | — | Spec Agent | Spec marked `implemented` |

### Entry Condition

- Stakeholder has a feature request or change requirement

### Exit Condition

- All acceptance tests pass
- Code review has no blocking findings
- Spec Agent validates implementation matches spec
- `spec-check` reports no new violations
- Spec status is set to `implemented`

### Metrics to Track

| Metric | What it measures | Target |
|--------|-----------------|--------|
| **Cycle time** | Total time from requirement to validated implementation | < 3 days |
| **Phase time breakdown** | Time spent in each phase (1A, 1B, 2, 3, 4, 5) | Track distribution |
| **Loop 3 triggers** | Number of refinement loops during the cycle | < 2 |
| **First-pass validation rate** | % of features that pass validation without re-entering Loop 2/3 | > 70% |
| **Total test count** | Acceptance tests created for the feature | Track per feature |

### Common Failure Modes

- Skipping phases (going straight from spec to implementation without tests)
- Not doing Phase 1D (stakeholder review) → rework after implementation
- Code review done too late → architectural issues require rewrite
- Validation reveals spec drift → costly re-implementation

---

## Loop 5 — Meta Loop (Process Improvement)

**Speed**: Very slow (weekly or per-sprint)
**Agents**: Process Agent (planned), Audit Agent supplies drift data, all agents contribute data

### Purpose

Look at the data from multiple Full Cycles (Loop 4) and extract patterns, bottlenecks, and improvement opportunities. This is the learning loop that makes the whole system better over time.

### Flow

```
Multiple Full Cycles complete (Loop 4 × N)
        │
        ▼
┌───────────────────┐
│  COLLECT           │
│  Gather metrics    │
│  from all cycles   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  ANALYZE           │
│  Find patterns     │
│  and bottlenecks   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  DIAGNOSE          │
│  Root cause of     │
│  recurring issues  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  IMPROVE           │
│  Update process,   │
│  templates, agent  │
│  contexts          │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  MEASURE           │
│  Did the change    │
│  improve outcomes? │
└────────┬──────────┘
         │
         ▼
    Next batch of cycles
```

### What Gets Analyzed

#### Per-Cycle Metrics (collected automatically)

| Category | Metrics |
|----------|---------|
| **Time** | Total cycle time, phase breakdown, time-in-loop |
| **Iterations** | Loop 1 rounds, Loop 3 triggers, validation re-entries |
| **Quality** | Regression count, test pass rate on first run, conflicts found |
| **Volume** | Specs created/modified/deleted, tests created, LOC changed |
| **Drift** | `spec-check` baseline size, new violations blocked in CI, audit findings per category (see [SPEC-AUDIT.md](./SPEC-AUDIT.md#metrics)) |

#### Pattern Analysis (periodic review)

| Question | What it reveals | Action if problematic |
|----------|----------------|----------------------|
| Which specs needed the most refinement? | Weak areas in spec writing | Improve spec templates or Spec Agent context |
| Which phases take the longest? | Bottlenecks in the process | Optimize that phase or parallelize |
| How often does Loop 3 trigger? | Spec clarity issues | Invest more in Loop 1 |
| What types of ambiguities recur? | Systematic gaps in specs | Add checklist items to spec template |
| Are acceptance tests catching real bugs? | Test quality | Improve QA Agent context |
| How often does Dev modify `.feature` files? | Agent boundary violations | Reinforce boundaries in Dev Agent context |
| What's the first-pass validation rate? | Process maturity | Target > 70% |
| How many UNSPECIFIED findings per audit? | Agents adding unrequested behavior | Tighten agent rules; make specs more explicit about non-goals |
| Is the `spec-check` baseline shrinking? | Progress towards full traceability | Schedule reverse-spec work ([BROWNFIELD-ADOPTION.md](./BROWNFIELD-ADOPTION.md)) |

#### Trend Tracking (over time)

```
Week    Cycle Time    Loop 3 Triggers    First-Pass Validation
─────   ──────────    ───────────────    ─────────────────────
  1        5 days            4                   40%
  2        4 days            3                   50%
  3        3 days            2                   60%
  4        2.5 days          1                   75%
  ...
```

The goal is to see these numbers improve over time. If they plateau or regress, something in the process needs attention.

### Improvement Categories

| Category | Examples |
|----------|---------|
| **Templates** | Add missing sections to spec template, improve UX wireframe template |
| **Agent Contexts** | Refine agent prompts, add examples of common mistakes |
| **Checklists** | Add items to spec review checklist, testing checklist |
| **Standards** | Update TESTING.md, CODE-STYLE.md based on recurring issues |
| **Workflow** | Add/remove phases, change approval gates, parallelize steps |
| **Documentation** | Update GLOSSARY.md, add FAQ, document learned patterns |

### Entry Condition

- At least 3-5 Full Cycles (Loop 4) completed
- Or: a significant process failure occurred

### Exit Condition

- Improvement actions documented
- Changes applied to templates, standards, or agent contexts
- Baseline metrics recorded for comparison

### Common Failure Modes

- Not collecting metrics → no data to analyze
- Collecting metrics but never analyzing them → data hoarding
- Making changes without measuring impact → no feedback on improvements
- Optimizing for speed at the cost of quality → technical debt accumulates
- Changing too many things at once → can't tell what helped

---

## Loop Interaction Rules

### When to Escalate to a Higher Loop

| Situation | Current Loop | Escalate To |
|-----------|-------------|-------------|
| Spec is unclear during test writing | Loop 2 | Loop 3 (Refinement) |
| Test seems wrong during implementation | Loop 2 | Loop 3 (Refinement) |
| Implementation reveals design flaw | Loop 2/3 | Loop 1 (re-spec) |
| Validation fails | Loop 4 | Loop 2 or 3 |
| Same type of issue keeps recurring | Loop 3 | Loop 5 (Process Improvement) |

### When to Stay in the Current Loop

| Situation | Stay In | Why |
|-----------|---------|-----|
| Test fails, implementation is clearly wrong | Loop 2 | Fix the code, don't escalate |
| Minor refactor opportunity during Green phase | Loop 2 | Refactor is part of the cycle |
| Typo in spec discovered | Loop 2 | Fix inline, no formal refinement needed |

### The "Three Strikes" Rule

If Loop 3 triggers **three or more times** for a single feature, this is a signal that Loop 1 was insufficient. Instead of continuing to iterate in Loop 3:

1. **Stop** implementation
2. **Re-enter Loop 1** — go back to the Spec Agent
3. **Re-spec** the feature from scratch with the learnings from the failed attempts
4. **Document** what went wrong for Loop 5 analysis

---

## Metrics Dashboard (Template)

Use this template to track metrics across features:

```markdown
# Development Metrics — [Sprint/Period]

## Summary

| Metric | This Period | Previous | Trend |
|--------|------------|----------|-------|
| Avg cycle time | X days | Y days | ↓ improving |
| Avg Loop 3 triggers | X | Y | ↓ improving |
| First-pass validation rate | X% | Y% | ↑ improving |
| Regression count | X | Y | ↓ improving |

## Per-Feature Breakdown

| Feature | Cycle Time | L1 Rounds | L3 Triggers | Validation | Notes |
|---------|-----------|-----------|-------------|------------|-------|
| feature-a | 2 days | 1 | 0 | Pass | Clean cycle |
| feature-b | 4 days | 3 | 2 | Fail → Pass | Spec was vague |
| feature-c | 1 day | 1 | 0 | Pass | Small change |

## Bottleneck Analysis

- **Slowest phase**: [Phase X — Y hours average]
- **Most common Loop 3 trigger**: [ambiguity type]
- **Recurring issues**: [list]

## Improvement Actions

- [ ] Action 1: [what to change] — [expected impact]
- [ ] Action 2: [what to change] — [expected impact]
```

---

## Related Documents

- [SPEC-DRIVEN-WORKFLOW.md](./SPEC-DRIVEN-WORKFLOW.md) — The linear workflow phases
- [AGENT-ROLES.md](./AGENT-ROLES.md) — Agent definitions and boundaries
- [SPEC-FORMAT.md](./SPEC-FORMAT.md) — How to write specs (Loop 1 output)
- [SPEC-AUDIT.md](./SPEC-AUDIT.md) — Drift findings feed Loop 5
- [`../standards/TESTING.md`](../standards/TESTING.md) — How to write tests (Loop 2 input)

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-07-26 | Initial version — 5 development loops defined | Pablo López Torres |
| 1.1.0 | 2026-10-08 | Drift metrics and Audit Agent input to Loop 5; `spec-check` in Loop 4 exit | Pablo López Torres |
