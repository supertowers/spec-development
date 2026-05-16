# Spec-Driven Development Workflow

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Author** | Pablo López Torres / Alice Evergreen |

---

## Overview

We follow a **Spec-Driven Development (SDD)** workflow where every feature is guided by a written specification before any code is written. This ensures clarity, reduces ambiguity, and provides an objective way to verify that code meets requirements.

### Core Principle

> **The spec is the source of truth. Tests validate the spec. Code implements the spec.**

### Why Spec-Driven?

- **Clarity**: Forces explicit definition of *what* before *how*
- **Objectivity**: Tests provide measurable success criteria
- **Iteration**: Specs can be refined based on implementation learnings
- **AI-Friendly**: Clear specs enable effective AI-assisted development
- **Living Documentation**: Specs stay in sync with the system

### BDD, not TDD

This workflow follows **Behavior-Driven Development** principles:

- **BDD**: scenarios describe observable behavior from the user's or system's perspective, in business language. Implementation details (function names, database collections, message types) never appear in a `.feature` file.
- **TDD**: tests describe internal implementation details. These belong in unit tests, not in `.feature` files.

A `.feature` scenario is correct if a non-technical stakeholder can read it and understand what the system does. If it mentions implementation details, it is a unit test disguised as a BDD scenario — move it.

---

## The Six Roles

Development work is distributed across six specialized roles. These can be performed by different people/agents or by the same person in different modes. The UX Designer and UI Designer roles are **optional** — only required when the feature has a user interface.

### 1. Spec Manager 📋

**Primary Responsibility**: Own the complete specification system and ensure coherence.

**Key Activities**:
- Converses with stakeholders to understand requirements
- Analyzes existing specs to identify what needs to change
- Checks for conflicts with other specs before writing
- Writes, modifies, or deletes specifications in `/docs/specs/`
- Validates coherence across the entire spec system
- Reviews implementation against specs
- Refines specs when ambiguities are discovered

**Outputs**:
- Specification documents (`.md` files) — new, modified, or deleted
- Coherence validation reports

**Success Criteria**:
- All requirements are captured in specs
- Specs are internally consistent across the entire system
- No conflicting or contradictory specs exist
- All acceptance criteria are testable

---

### 2. UX Designer 🗺️ *(optional — only for features with UI)*

**Primary Responsibility**: Define the user journey and interaction flow before any visual design begins.

**Key Activities**:
- Reads the spec from Phase 1A to understand requirements
- Maps the **user journey**: the sequence of steps a user takes to accomplish the goal
- Writes user-facing Gherkin scenarios (business language, no implementation details)
- Produces ASCII wireframes showing the structure and states of each screen
- Documents navigation flows, empty states, loading states, and error states
- Does NOT make visual design decisions (colors, typography) — that is Phase 1C

**Outputs**:
- `/docs/specs/{namespace}/{feature}/ux.md` — user journey + ASCII wireframes + user-facing Gherkin scenarios

**Success Criteria**:
- The user journey is complete: entry point, happy path, error paths, exit point
- Every screen state is represented in at least one ASCII wireframe
- Gherkin scenarios are readable by non-technical stakeholders
- No implementation details appear in scenarios or wireframes

---

### 3. UI Designer 🎨 *(optional — only for features with UI)*

**Primary Responsibility**: Produce a visual prototype that stakeholders can validate before implementation begins.

**Key Activities**:
- Reads the UX spec (`ux.md`) from Phase 1B
- Produces an HTML/CSS prototype faithful to the design system tokens
- Covers all states defined in the UX wireframes (empty, loading, error, filled)
- Does NOT write JavaScript logic — static HTML only
- Iterates based on feedback during Phase 1D

**Outputs**:
- `/docs/specs/{namespace}/{feature}/ui/prototype.html` — static visual prototype
- `/docs/specs/{namespace}/{feature}/ui/notes.md` — design decisions and component references

**Success Criteria**:
- Prototype is visually faithful to the design system
- All states from the UX wireframes are represented
- A non-technical stakeholder can validate the design by opening the HTML file in a browser
- No JavaScript logic — purely static

---

### 4. Test Writer 🧪

**Primary Responsibility**: Produce the final acceptance tests from the spec and UX artifacts.

**Key Activities**:
- Reads the spec (Phase 1A) and, if it exists, the UX spec (Phase 1B)
- Reuses user-facing Gherkin scenarios from `ux.md` when they already cover an AC
- Writes additional system-level Gherkin scenarios for ACs not covered by the UX spec
- Ensures all acceptance criteria are covered
- Does NOT write unit tests (Developer's responsibility)

**The two levels of Gherkin**:

| Level | Subject | Language | Example |
|-------|---------|----------|---------|
| **User-facing** | The human user | Business | `When I submit the form` |
| **System-facing** | The system | Observable behavior | `When the payment processor responds` |
| **❌ Not BDD** | The code internals | Technical | `When PaymentService.charge() is called` |

**Outputs**:
- Acceptance test files in `/tests/acceptance/` (`.feature` files)

**Success Criteria**:
- Every acceptance criterion has at least one scenario
- All scenarios are in Given-When-Then format
- No scenario mentions implementation details

**Note on executability**:

`.feature` files are first and foremost **documentation**. A well-written `.feature` file lets any team member read it and know exactly what the system must do to satisfy an acceptance criterion — no tooling required.

If the project has a Gherkin test runner configured (Cucumber.js, Vitest with Gherkin plugin, etc.), the same files become executable. Executability is a bonus, not a prerequisite. Write scenarios as if they will be read by a human; if they can also be run by a machine, even better.

> **Rule**: never sacrifice clarity for machine-readability. A scenario that a human cannot understand is not a BDD scenario.

---

### 5. Developer 👨‍💻

**Primary Responsibility**: Implement code to satisfy specs and pass tests.

**Key Activities**:
- Reads spec, UX spec (if exists), UI prototype (if exists), and acceptance tests
- Implements code to make acceptance tests pass
- Writes unit tests as needed for complex internal logic
- Reports spec ambiguities back to Spec Manager
- Refactors code while keeping tests green

**Outputs**:
- Production code in appropriate packages
- Unit tests (as needed)

**Success Criteria**:
- All acceptance tests pass
- Code follows CODE-STYLE.md guidelines
- No regressions in existing functionality

---

### 6. Code Reviewer / Architect 🏗️

**Primary Responsibility**: Ensure the implementation is architecturally coherent, internally consistent, and free of duplication.

**Key Activities**:
- Reads the implementation produced in Phase 3
- Audits the diff against the existing codebase for duplication and inconsistency
- Verifies that engineering principles are applied in the code
- Identifies logic that belongs in a different module or layer
- Does NOT rewrite code unilaterally — raises findings and requests changes from the Developer

**The boundary with other roles**:

| Question | Owner |
|----------|-------|
| Does the code do what the spec says? | Spec Manager (Phase 5) |
| Do the tests cover the spec? | Test Writer |
| Does the code work? | Developer + tests |
| Is the code architecturally coherent? | **Code Reviewer / Architect** |
| Is there duplicated logic? | **Code Reviewer / Architect** |
| Are engineering principles applied? | **Code Reviewer / Architect** |

**Outputs**:
- Code review report listing findings by severity (blocking / non-blocking)

**Success Criteria**:
- No logic duplicated from existing modules
- No engineering principle violations
- Responsibilities are in the correct layer
- New patterns are consistent with existing patterns

---

## The Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER REQUEST                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
╔═════════════════════════════════════════════════════════════════╗
║  PHASE 1A — Specification                  [Spec Manager]       ║
║                                                                 ║
║  1. Analyze existing specs for conflicts                        ║
║  2. Write/modify/delete spec in /docs/specs/{ns}/feature.md     ║
║     → REQ-N (functional requirements)                           ║
║     → NFR-N (non-functional requirements)                       ║
║     → AC-N  (acceptance criteria, testable)                     ║
║  3. Validate system-wide coherence                              ║
╚══════════════════════════╤══════════════════════════════════════╝
                           │
                           ▼ Does the feature have a UI?
                    ┌──────┴──────┐
                   YES            NO
                    │              │
                    ▼              │
╔══════════════════════════╗      │
║  PHASE 1B — UX           ║      │
║  [UX Designer]           ║      │
║  → User journey          ║      │
║  → User-facing Gherkin   ║      │
║  → ASCII wireframes      ║      │
╚══════════╤═══════════════╝      │
           │                      │
           ▼                      │
╔══════════════════════════╗      │
║  PHASE 1C — UI Prototype ║      │
║  [UI Designer]           ║      │
║  → Static HTML prototype ║      │
║  → All states covered    ║      │
║  → Design system tokens  ║      │
╚══════════╤═══════════════╝      │
           │                      │
           ▼                      │
╔══════════════════════════╗      │
║  PHASE 1D — User Review  ║      │
║  [Stakeholder / PO]      ║      │
║  → Reviews ux.md +       ║      │
║    prototype.html        ║      │
║  → Explicit approval     ║      │
║    required to proceed   ║      │
╚══════════╤═══════════════╝      │
           │ approved              │
           └──────────┬────────────┘
                      │
                      ▼
╔═════════════════════════════════════════════════════════════════╗
║  PHASE 2 — Acceptance Tests                [Test Writer]        ║
║                                                                 ║
║  → Reuse user-facing Gherkin from ux.md if it exists           ║
║  → Write system-level scenarios for remaining ACs              ║
║  → No implementation details in any scenario                   ║
║                                                                 ║
║  /tests/acceptance/{ns}/feature.feature                        ║
╚══════════════════════════╤══════════════════════════════════════╝
                           │
                           ▼
╔═════════════════════════════════════════════════════════════════╗
║  PHASE 3 — Implementation                  [Developer]          ║
║                                                                 ║
║  Red 🔴 → Green 🟢 → Refactor                                  ║
║                                                                 ║
║  → Read spec + ux.md + prototype + .feature                    ║
║  → Implement until all acceptance tests pass                   ║
║  → Write unit tests for complex internal logic                 ║
╚══════════════════════════╤══════════════════════════════════════╝
                           │
                           ▼
                  Run Acceptance Tests
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
          ✅ PASS                   ❌ FAIL
              │                         │
              │              ┌──────────┴───────────┐
              │              │                      │
              │              ▼                      ▼
              │      Implementation Bug      Spec Ambiguous
              │              │                      │
              │              ▼                      ▼
              │      Developer Fixes         Spec Manager
              │                              Refines Spec
              │                                     │
              └─────────────┬───────────────────────┘
                            │
                            ▼
╔═════════════════════════════════════════════════════════════════╗
║  PHASE 4 — Code Review              [Code Reviewer / Architect] ║
║                                                                 ║
║  → Is there duplicated logic in the codebase?                  ║
║  → Are engineering principles applied?                         ║
║  → Are responsibilities in the correct layer?                  ║
║  → Are new patterns consistent with existing ones?             ║
║                                                                 ║
║  ✅ OK → proceed to Phase 5                                    ║
║  🔴 Blocking findings → Developer fixes, re-review             ║
╚══════════════════════════╤══════════════════════════════════════╝
                           │
                           ▼
╔═════════════════════════════════════════════════════════════════╗
║  PHASE 5 — Validation                      [Spec Manager]       ║
║                                                                 ║
║  → Does implementation match spec?                             ║
║  → Does UI match the approved prototype?                       ║
║  → Are there inconsistencies with other specs?                 ║
║                                                                 ║
║  ✅ OK → mark spec as Active/Implemented                       ║
║  🔄 Not OK → refine and iterate from Phase 2 or 3             ║
╚══════════════════════════╤══════════════════════════════════════╝
                           │
                           ▼
                       ✅ DONE
```

---

## File Organization

### Specifications

For the full directory structure and naming conventions, see [`process/SPEC-FORMAT.md`](./SPEC-FORMAT.md#directory-structure).

### Acceptance Tests

Location: `/tests/acceptance/` (mirrors spec structure)

```
tests/acceptance/
├── core/
│   └── authentication.feature
├── billing/
│   └── subscription.feature
└── ui/
    └── dashboard.feature
```

---

## Spec Coherence

One of the most critical responsibilities of the Spec Manager is maintaining coherence across all specifications.

### Coherence Checklist

Before finalizing any spec change:

**Terminology**:
- [ ] Are terms defined the same way across specs?
- [ ] Are new terms added to a glossary if needed?

**Dependencies**:
- [ ] Have I identified all specs that depend on this one?
- [ ] Are dependencies explicitly documented?

**Conflicts**:
- [ ] Does this spec contradict any existing spec?
- [ ] Are there competing approaches to the same problem?

**Impact**:
- [ ] Which other specs are affected by this change?
- [ ] Do any acceptance tests need updating?
- [ ] Does existing implementation need changes?

---

## Communication Between Roles

### Spec Manager → Test Writer

```
Spec ready for testing:
- Spec: /docs/specs/{namespace}/[feature].md
- Action: Created / Modified / Deleted
- Acceptance Criteria: [count]
- Priority: P0 / P1 / P2

Action Required: Create/update/delete acceptance tests in /tests/acceptance/{namespace}/
```

### Test Writer → Developer

```
Tests ready for implementation:
- Tests: /tests/acceptance/{namespace}/[feature].feature
- Scenarios: [count]
- All scenarios currently: FAILING (expected)

Action Required: Implement until all scenarios pass.
```

### Developer → Code Reviewer

```
Implementation complete:
- All [N] acceptance tests: PASSING
- Files changed: [list]
- Unit tests added: [yes/no]

Action Required: Code review for architectural coherence.
```

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-05-16 | Initial version | Pablo López Torres |
