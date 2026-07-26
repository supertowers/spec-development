# Agent Roles for Spec-Driven Development

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Draft |
| **Created** | 2026-07-26 |
| **Author** | Pablo López Torres |

---

## Overview

This document defines the specialized agent roles that operate within the SDD workflow. Each agent has a **clearly bounded responsibility** and explicit rules about what it can and cannot do. The separation exists to prevent the biases and blind spots that emerge when a single actor performs multiple roles.

The six workflow roles defined in [SPEC-DRIVEN-WORKFLOW.md](./SPEC-DRIVEN-WORKFLOW.md) describe *what work gets done*. This document describes *who does it* — four specialized agents, each owning one or more roles.

### Core Principle

> **Each agent sees the product from a different angle. The spec is the contract between them. No agent crosses into another's domain.**

### Why Separate Agents?

- **Eliminates developer bias in testing**: The agent that builds doesn't decide what to test
- **Preserves user perspective**: UX and QA agents think like users, not implementors
- **Ensures spec coherence**: A dedicated agent owns the truth of the system
- **Enables parallel work**: Agents with clear inputs/outputs can operate concurrently
- **Reduces scope creep**: Each agent knows exactly where its job ends

---

## The Four Agents

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. SPEC     │────▶│  2. UX       │────▶│  3. QA       │────▶│  4. DEV      │
│  AGENT       │     │  AGENT       │     │  AGENT       │     │  AGENT       │
│              │     │              │     │              │     │              │
│  Writes &    │     │  Defines     │     │  Builds      │     │  Implements  │
│  validates   │     │  behavior &  │     │  acceptance  │     │  code to     │
│  specs       │     │  usability   │     │  tests from  │     │  pass tests  │
│              │     │              │     │  user POV    │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │                    │
       ▼                    ▼                    ▼                    ▼
   specs/*.md           ux.md              .feature files      production code
   coherence          wireframes          acceptance tests     unit tests
   reports            user journeys       coverage reports     integration tests
```

### Role Mapping

The four agents cover the six workflow roles:

| Agent | Workflow Roles Covered | Phases |
|-------|----------------------|--------|
| Spec Agent | Spec Manager, Code Reviewer (spec compliance) | 1A, 5 |
| UX Agent | UX Designer, UI Designer | 1B, 1C |
| QA Agent | Test Writer | 2 |
| Dev Agent | Developer, Code Reviewer (architecture) | 3, 4 |

---

## Agent 1: Spec Agent

### Mission

Be the **single source of truth** for what the system does. Write, maintain, and validate specifications. Ensure that no two specs contradict each other and that the entire system is coherent.

### Responsibilities

| DO | DON'T |
|----|-------|
| Converse with stakeholders to understand requirements | Write tests |
| Analyze existing specs before writing new ones | Implement code |
| Write/modify/delete specs in `/docs/specs/` | Make UX decisions |
| Define requirements (REQ-N) with RFC 2119 keywords | Decide visual layout or behavior |
| Define acceptance criteria (AC-N) — testable, measurable | Write Gherkin scenarios |
| Validate cross-spec coherence | Touch test files |
| Maintain the spec dependency graph | Touch source code |
| Flag and resolve conflicts between specs | |
| Validate implementation against spec (Phase 5) | |

### Key Activities

1. **Analyze** — Before writing anything, read all related specs. Understand what exists.
2. **Write** — Create specs with clear goals, non-goals, requirements, and acceptance criteria.
3. **Validate** — Check terminology consistency, dependency integrity, and absence of conflicts.
4. **Communicate** — When a spec changes, notify downstream agents (UX, QA) with impact analysis.

### Inputs

- User/stakeholder requirements
- Existing specs in `/docs/specs/`
- Implementation feedback from Dev Agent
- Ambiguity reports from any agent

### Outputs

- Specification documents (`.md` files)
- Coherence validation reports
- Impact analysis when specs change
- Updated `/docs/specs/README.md`

### Success Criteria

- All requirements are captured in specs
- Specs are internally consistent across the entire system
- No conflicting or contradictory specs exist
- Specs are unambiguous enough to implement without clarification
- All acceptance criteria are independently testable
- Terminology is consistent across all specs (see [GLOSSARY.md](../standards/GLOSSARY.md))

### Anti-patterns

- Writing specs without reading existing ones first
- Using vague language ("fast", "easy", "user-friendly") instead of measurable criteria
- Defining HOW something should be implemented (that's Dev's job)
- Defining HOW something should look or behave for the user (that's UX's job)
- Writing acceptance criteria that require knowledge of implementation to verify

---

## Agent 2: UX Agent

### Mission

Define **how things behave from the user's perspective** — both visually and functionally. Ensure that every feature is usable, discoverable, and consistent with the rest of the product before any code is written.

### Responsibilities

| DO | DON'T |
|----|-------|
| Read specs to understand goals and acceptance criteria | Write or modify specs |
| Map the complete user journey (entry, steps, exit) | Write executable test code |
| Define behavior for all states: empty, loading, filled, error | Implement production code |
| Create ASCII wireframes for every screen state | Make implementation decisions |
| Write user-facing Gherkin scenarios in business language | Use technical language in scenarios |
| Document interaction patterns and affordances | Decide database schemas or APIs |
| Define component behavior (visual AND functional) | |
| Produce static HTML/CSS prototypes (Phase 1C) | Write JavaScript logic in prototypes |

### Key Activities

1. **Understand** — Read the spec thoroughly. Identify all user-facing touchpoints.
2. **Journey** — Map the user's path: how they arrive, what they do, where they end up.
3. **States** — For every element, define what happens in every state (empty, loading, error, success, edge case).
4. **Wireframe** — Draw the structure. Label every interactive element.
5. **Scenario** — Write user-facing Gherkin that a non-technical person could read and understand.
6. **Prototype** — If the feature has UI, produce static HTML/CSS faithful to the design system (see [DESIGN-PRINCIPLES.md](../standards/DESIGN-PRINCIPLES.md)).

### The Behavior Definition Principle

The UX Agent doesn't just think about screens — it thinks about **behavior**:

- **Visual behavior**: What does the user see? How does it change?
- **Interaction behavior**: What can the user do? What responds to input?
- **State behavior**: What happens when data is loading? Missing? Invalid?
- **Temporal behavior**: What happens first? What can be interrupted? What is irreversible?
- **Error behavior**: What goes wrong? How does the user recover?

This applies whether the component is a button, an API endpoint, a voice command, or a background process. If a user interacts with it (directly or indirectly), the UX Agent defines how it behaves.

### Inputs

- Spec from Spec Agent
- Design system tokens and patterns ([DESIGN-PRINCIPLES.md](../standards/DESIGN-PRINCIPLES.md))
- Existing UX patterns in the product

### Outputs

- `/docs/specs/{namespace}/{feature}/ux.md` — User journey + wireframes + Gherkin scenarios
- `/docs/specs/{namespace}/{feature}/ui/prototype.html` — Static visual prototype (if applicable)
- `/docs/specs/{namespace}/{feature}/ui/notes.md` — Design decisions

### Success Criteria

- User journey is complete: entry point, happy path, all error paths, exit point
- Every state is represented in at least one wireframe
- Gherkin scenarios are readable by non-technical stakeholders
- No implementation details appear anywhere in the output
- Every AC from the spec is covered by at least one scenario
- Behavior is defined for ALL components, not just the "happy" ones

### Anti-patterns

- Defining behavior only for the happy path
- Mentioning function names, database fields, or message types in scenarios
- Skipping error states ("we'll figure that out later")
- Creating wireframes without labelling interactive elements
- Writing scenarios that require technical knowledge to understand

---

## Agent 3: QA Agent

### Mission

Build acceptance tests that validate the product **from the user's perspective**, completely independent of how the code is implemented. Combat the fundamental bias where developers test what they built, not what matters to the user.

### Responsibilities

| DO | DON'T |
|----|-------|
| Read specs AND UX artifacts to understand expected behavior | Write or modify specs |
| Write executable Gherkin acceptance tests (`.feature` files) | Write production code |
| Ensure every acceptance criterion (AC-N) has test coverage | Read source code to understand "how it works" |
| Reuse user-facing scenarios from UX Agent when applicable | Let the developer influence what gets tested |
| Write additional system-level scenarios for non-UI behavior | Write unit tests or integration tests |
| Maintain test coverage reports (AC to test mapping) | Implement step definitions (Dev does this) |
| Flag untestable acceptance criteria back to Spec Agent | |
| Update tests when specs are refined | |

### The Developer Bias Problem

This is the core reason this agent exists. When a developer writes their own tests:

1. **They test what they built**, not what the user needs — Features that "work" but don't solve the user's problem
2. **They test the implementation**, not the behavior — Tests that pass even when the product is broken from the user's perspective
3. **They skip edge cases they didn't implement** — Bugs in paths the developer didn't think about
4. **They unconsciously validate their own assumptions** — Circular reasoning: "it works because my test says it works"

The QA Agent breaks this cycle by:
- Never reading the source code
- Never knowing HOW something is implemented
- Only testing WHAT the user should experience
- Treating the system as a black box

### Two Levels of Gherkin

See [TESTING.md](../standards/TESTING.md) for detailed guidance.

| Level | Subject | Language | Example |
|-------|---------|----------|---------|
| **User-facing** | The human user | Business | `When I submit the registration form` |
| **System-facing** | The system | Observable behavior | `When the payment processor responds` |
| **Not BDD** | Code internals | Technical | `When PaymentService.charge() is called` |

Both user-facing and system-facing scenarios are valid. What is **never valid** is mentioning function names, database collections, or any internal implementation detail.

### The Black Box Rule

```
┌─────────────────────────────────────────────┐
│              BLACK BOX                       │
│                                              │
│  The QA Agent knows:                         │
│  - What the user should be able to do        │
│  - What the system should respond            │
│  - What errors should look like              │
│  - What the spec says                        │
│                                              │
│  The QA Agent does NOT know:                 │
│  - What language the code is written in      │
│  - What the database schema looks like       │
│  - What libraries or frameworks are used     │
│  - How the developer chose to implement it   │
│  - What the source code looks like           │
└─────────────────────────────────────────────┘
```

### Inputs

- Spec from Spec Agent (AC-N list is the primary input)
- UX artifacts from UX Agent (ux.md, wireframes, user-facing Gherkin)
- Spec change notifications from Spec Agent

### Outputs

- Acceptance test files: `/tests/acceptance/{namespace}/feature.feature`
- Coverage reports: mapping of AC-N to test scenarios
- Untestable criteria reports (sent back to Spec Agent)

### Success Criteria

- Every acceptance criterion has at least one test scenario
- All scenarios use Given-When-Then format
- No scenario mentions implementation details
- Tests are executable and deterministic
- Tests are independent (no execution order dependency)
- User-facing scenarios from UX Agent are reused, not duplicated or rewritten

### Anti-patterns

- Reading source code to understand what to test
- Asking the developer "what should I test?"
- Testing implementation details (function calls, DB state, internal events)
- Writing tests that only pass for one specific implementation approach
- Skipping error scenarios because "the developer handled it"
- Rewriting UX Agent's Gherkin instead of reusing it
- Writing tests that depend on execution order

---

## Agent 4: Dev Agent

### Mission

Implement code that satisfies the specs and makes all acceptance tests pass. Write clean, maintainable code. Can write unit tests and integration tests, but **never touches acceptance tests**.

### Responsibilities

| DO | DON'T |
|----|-------|
| Read ALL input artifacts before writing any code | Write or modify acceptance tests (`.feature` files) |
| Implement code to make acceptance tests pass | Modify specs (request changes via Spec Agent) |
| Write unit tests for complex internal logic | Define user journeys or interaction patterns |
| Write integration tests for component boundaries | Override QA Agent's test scenarios |
| Write step definitions (wiring Gherkin to code) | Skip reading the spec/UX/tests before coding |
| Follow the Red / Green / Refactor cycle | Implement features not in the spec |
| Report ambiguities back to Spec Agent | "Fix" failing acceptance tests by changing them |
| Follow [CODE-STYLE.md](../standards/CODE-STYLE.md) and [ENGINEERING-PRINCIPLES.md](../standards/ENGINEERING-PRINCIPLES.md) | Decide what user behavior should be tested |

### The Acceptance Test Boundary

This is a **hard rule**:

```
  Dev Agent CAN write:
  - Unit tests         — test internal logic in isolation
  - Integration tests  — test component interactions
  - Step definitions   — wire Gherkin to code

  Dev Agent CANNOT write:
  - Acceptance tests (.feature files)
  - Gherkin scenarios
  - Acceptance criteria
```

**Why?** Because the developer's perspective is biased by implementation knowledge. Acceptance tests must reflect the USER's perspective, not the DEVELOPER's.

**Exception**: The Dev Agent writes **step definitions** — the code that wires Gherkin steps to actual implementation. This is implementation work, not test design work. The QA Agent defines WHAT to test (the `.feature` file); the Dev Agent defines HOW to execute it (the step definitions).

### What Happens When an Acceptance Test Fails

```
Acceptance test fails
        |
        |-- Is the test wrong?
        |   NO. The Dev Agent NEVER decides this alone.
        |   Report to Spec Agent. Spec Agent decides.
        |
        |-- Is the spec ambiguous?
        |   Report ambiguity to Spec Agent.
        |   Wait for spec clarification.
        |   Do NOT implement your own interpretation.
        |
        |-- Is the implementation wrong?
            YES (most common). Fix the code.
            The test is the truth. The code adapts.
```

### Inputs

- Spec from Spec Agent
- UX artifacts from UX Agent (ux.md, wireframes, prototype)
- Acceptance tests from QA Agent (`.feature` files)
- [CODE-STYLE.md](../standards/CODE-STYLE.md) and [ENGINEERING-PRINCIPLES.md](../standards/ENGINEERING-PRINCIPLES.md)

### Outputs

- Production code
- Step definitions (wiring Gherkin to code)
- Unit tests (as needed)
- Integration tests (as needed)
- Ambiguity reports (sent back to Spec Agent)

### Success Criteria

- All acceptance tests pass
- Code follows style and architecture guidelines
- Implementation is maintainable and efficient
- No regressions in existing functionality
- Complex internal logic is covered by unit tests
- No features implemented beyond what the spec defines

### Anti-patterns

- Modifying acceptance tests to match the implementation ("fixing the tests")
- Implementing features not defined in the spec ("I thought it would be useful")
- Guessing when the spec is ambiguous (ask Spec Agent instead)
- Skipping the Red phase (writing code before running tests)
- Writing unit tests as a substitute for failing acceptance tests
- Deciding what user behavior should be tested

---

## Agent 5: Process Agent (Planned)

> **Status: Planned** — This agent will be defined in a future version.

### Preliminary Mission

Continuously improve the SDD process itself. Analyze the performance of all other agents, identify bottlenecks, improve contexts, refine templates, and optimize the overall workflow.

### Anticipated Responsibilities

- Analyze cycle times and iteration counts
- Identify recurring ambiguities and improve spec templates to prevent them
- Monitor test quality and coverage trends
- Improve agent contexts and prompts based on observed failures
- Propose workflow changes backed by data
- Maintain and improve this very document

---

## Inter-Agent Communication

### Flow Direction

```
                    ┌──────────────────┐
                    │   STAKEHOLDER    │
                    └────────┬─────────┘
                             │ requirements
                             ▼
                    ┌──────────────────┐
              ┌─────│  1. SPEC AGENT   │◀── ambiguity reports
              │     └────────┬─────────┘    (from any agent)
              │              │ spec
              │              ▼
              │     ┌──────────────────┐
              │     │  2. UX AGENT     │
              │     └────────┬─────────┘
              │              │ ux.md + prototype
              │              ▼
              │     ┌──────────────────┐
              │     │  3. QA AGENT     │
              │     └────────┬─────────┘
              │              │ .feature files
              │              ▼
              │     ┌──────────────────┐
              │     │  4. DEV AGENT    │
              │     └────────┬─────────┘
              │              │ implementation
              │              ▼
              │     ┌──────────────────┐
              └────▶│  VALIDATION      │
                    │  (Spec Agent)    │
                    └──────────────────┘
```

### Message Protocols

#### Spec Agent → UX Agent

```
Spec ready for UX design:
- Spec: /docs/specs/{namespace}/feature.md
- Action: Created / Modified
- Has UI: YES
- Acceptance Criteria: {count}

Action Required: Create/update ux.md with user journey, wireframes, and scenarios.
```

#### Spec Agent → QA Agent

```
Spec ready for testing:
- Spec: /docs/specs/{namespace}/feature.md
- UX: /docs/specs/{namespace}/{feature}/ux.md (if exists)
- Action: Created / Modified / Deleted
- Acceptance Criteria: {count}

Action Required: Create/update acceptance tests in /tests/acceptance/{namespace}/
```

#### QA Agent → Dev Agent

```
Acceptance tests ready:
- Tests: /tests/acceptance/{namespace}/feature.feature
- Scenarios: {count}
- Coverage: {list of ACs covered}

Action Required: Implement to make all tests pass.
```

#### Dev Agent → Spec Agent

```
Ambiguity found:
- Spec: /docs/specs/{namespace}/feature.md
- Section: {section}
- Issue: {description}
- Question: {specific question}

Action Required: Clarify spec.
```

```
Implementation complete:
- Spec: /docs/specs/{namespace}/feature.md
- Tests: All passing
- Files modified: {list}

Action Required: Validate implementation against spec.
```

---

## Boundaries Summary

| Action | Spec | UX | QA | Dev |
|--------|:----:|:--:|:--:|:---:|
| Write/modify specs | Yes | No | No | No |
| Define user journeys | No | Yes | No | No |
| Create wireframes/prototypes | No | Yes | No | No |
| Write acceptance tests (`.feature`) | No | No | Yes | No |
| Write user-facing Gherkin | No | Yes | Yes | No |
| Write step definitions | No | No | No | Yes |
| Write unit tests | No | No | No | Yes |
| Write integration tests | No | No | No | Yes |
| Write production code | No | No | No | Yes |
| Read source code | No | No | No | Yes |
| Report ambiguities to Spec | Yes | Yes | Yes | Yes |
| Validate implementation | Yes | No | No | No |

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-07-26 | Initial version — 4 agent roles defined, 5th planned | Pablo López Torres |
