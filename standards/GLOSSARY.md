# Glossary

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Created** | 2026-05-16 |
| **Updated** | 2026-05-16 |
| **Author** | Pablo López Torres / Alice Evergreen |

---

## Purpose

This glossary defines the terms used across all documents in this repo. When a term appears in a spec, process document, or standard, it means exactly what is defined here — no more, no less.

If you introduce a new term in a spec, add it here.

---

## Terms

### Acceptance Criterion (AC)

A specific, testable condition that must be true for a feature to be considered complete. Acceptance criteria are numbered (`AC-1`, `AC-2`, ...) and live in the spec. Every AC must map to at least one test scenario.

**See also**: [Spec](#spec), [Scenario](#scenario)

---

### Acceptance Test

A test that validates whether the system satisfies an acceptance criterion. Written in Gherkin (`.feature` files). Primarily documentation; may also be executable if the project has a Gherkin test runner configured.

**See also**: [Gherkin](#gherkin), [BDD](#bdd-behavior-driven-development)

---

### BDD (Behavior-Driven Development)

A development approach where behavior is described in business language before implementation begins. BDD scenarios describe observable outcomes — what the system does — not how it does it internally.

Contrast with [TDD](#tdd-test-driven-development).

---

### Code Reviewer / Architect

The role responsible for ensuring the implementation is architecturally coherent, free of duplication, and consistent with engineering principles. Does not rewrite code unilaterally — raises findings and requests changes from the Developer.

**See also**: [SPEC-DRIVEN-WORKFLOW.md](../process/SPEC-DRIVEN-WORKFLOW.md)

---

### Developer

The role responsible for writing production code that makes acceptance tests pass. Also writes unit tests for complex internal logic. Reports spec ambiguities to the Spec Manager.

**See also**: [SPEC-DRIVEN-WORKFLOW.md](../process/SPEC-DRIVEN-WORKFLOW.md)

---

### Feature File

A `.feature` file containing Gherkin scenarios for a specific feature. Lives in `/tests/acceptance/`. One feature file per spec file. Filename matches the spec filename (e.g., `authentication.md` → `authentication.feature`).

**See also**: [Gherkin](#gherkin), [TESTING.md](./TESTING.md)

---

### Functional Requirement (REQ)

A statement of what the system must do. Numbered (`REQ-1`, `REQ-2`, ...). Uses RFC 2119 keywords (`MUST`, `SHOULD`, `MAY`). Lives in the spec under `## Requirements`.

Contrast with [Non-Functional Requirement](#non-functional-requirement-nfr).

---

### Gherkin

A structured language for writing behavior scenarios using `Given / When / Then` syntax. Used for acceptance tests. Readable by non-technical stakeholders.

```gherkin
Scenario: Authenticate with valid credentials
  Given I am on the login page
  When I submit valid email and password
  Then I should be logged in
```

**See also**: [TESTING.md](./TESTING.md)

---

### Given / When / Then

The three steps of a Gherkin scenario:
- **Given**: the initial state (preconditions)
- **When**: the action being tested
- **Then**: the expected outcome (assertions)

---

### Namespace

A top-level grouping for specs and tests that corresponds to a domain or functional area of the product (e.g., `core/`, `billing/`, `ui/`). Namespaces are used to organize files in `/docs/specs/` and `/tests/acceptance/`.

---

### Non-Functional Requirement (NFR)

A constraint on how the system must behave, rather than what it must do. Examples: performance, security, availability, scalability. Numbered (`NFR-1`, `NFR-2`, ...). Lives in the spec under `## Requirements`.

Contrast with [Functional Requirement](#functional-requirement-req).

---

### Prototype

A static HTML/CSS file that visually represents a UI feature. No JavaScript logic. Produced by the UI Designer in Phase 1C. Used to validate visual design with stakeholders before implementation begins.

**See also**: [SPEC-DRIVEN-WORKFLOW.md](../process/SPEC-DRIVEN-WORKFLOW.md), [DESIGN-PRINCIPLES.md](./DESIGN-PRINCIPLES.md)

---

### Runbook

A document that describes a specific procedure that was or will be executed: a migration, a fix, a refactor, a deployment. Past/present-oriented. Distinct from a spec (which is future-oriented).

**See also**: [RUNBOOK-FORMAT.md](../process/RUNBOOK-FORMAT.md)

---

### Scenario

A single test case in a Gherkin feature file. Describes one specific behavior of the system in Given-When-Then format. Each scenario should be independent and deterministic.

**See also**: [Gherkin](#gherkin), [TESTING.md](./TESTING.md)

---

### SDD (Spec-Driven Development)

The development workflow defined in this repo. Every feature starts with a spec. Tests validate the spec. Code implements the spec. The spec is the source of truth.

**See also**: [SPEC-DRIVEN-WORKFLOW.md](../process/SPEC-DRIVEN-WORKFLOW.md)

---

### Spec

A markdown document that defines what a feature or system must do. Contains functional requirements, non-functional requirements, and acceptance criteria. Lives in `/docs/specs/`. The source of truth for a feature.

**See also**: [SPEC-FORMAT.md](../process/SPEC-FORMAT.md)

---

### Spec Manager

The role responsible for owning the complete specification system. Writes, modifies, and deletes specs. Validates coherence across all specs. Reviews implementation against specs in Phase 5.

**See also**: [SPEC-DRIVEN-WORKFLOW.md](../process/SPEC-DRIVEN-WORKFLOW.md)

---

### TDD (Test-Driven Development)

A development approach where unit tests are written before implementation. TDD tests describe internal implementation details (function names, data structures, algorithms). Distinct from BDD.

Contrast with [BDD](#bdd-behavior-driven-development).

---

### Test Writer

The role responsible for writing acceptance tests from the spec and UX artifacts. Reuses user-facing Gherkin scenarios from `ux.md` when available. Does not write unit tests.

**See also**: [SPEC-DRIVEN-WORKFLOW.md](../process/SPEC-DRIVEN-WORKFLOW.md), [TESTING.md](./TESTING.md)

---

### UI Designer

The role responsible for producing a static HTML/CSS prototype from the UX spec. Visual design only — no JavaScript logic. Works in Phase 1C.

**See also**: [SPEC-DRIVEN-WORKFLOW.md](../process/SPEC-DRIVEN-WORKFLOW.md)

---

### Unit Test

A test that validates internal implementation details (a function, a class, an algorithm). Written in `*.test.ts` files. The Developer's responsibility. Distinct from acceptance tests.

Contrast with [Acceptance Test](#acceptance-test).

---

### UX Designer

The role responsible for mapping the user journey and producing ASCII wireframes before visual design begins. Writes user-facing Gherkin scenarios. Works in Phase 1B.

**See also**: [SPEC-DRIVEN-WORKFLOW.md](../process/SPEC-DRIVEN-WORKFLOW.md)

---

### Wireframe

An ASCII diagram showing the structure and layout of a screen or UI state. Produced by the UX Designer in Phase 1B. No colors, no typography — structure only.

**See also**: [SPEC-DRIVEN-WORKFLOW.md](../process/SPEC-DRIVEN-WORKFLOW.md)

---

### Worklog

A document that records the work done during a development session: decisions made, problems encountered, and next steps. Distinct from a spec (what to build) and a runbook (how to execute a procedure).

**See also**: [WORKLOG-FORMAT.md](../process/WORKLOG-FORMAT.md)

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-05-16 | Initial version | Pablo López Torres / Alice Evergreen |
