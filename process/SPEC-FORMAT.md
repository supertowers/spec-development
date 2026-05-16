# Spec Format Guide

| Field | Value |
|-------|-------|
| **Version** | 1.2.0 |
| **Status** | Active |
| **Author** | Pablo López Torres / Alice Evergreen |

---

## Overview

This document defines the standard format for writing specifications. Following this format ensures consistency, completeness, and testability across all specs in any project.

---

## Directory Structure

Specs live in `/docs/specs/`, organized by domain/namespace.

```
docs/specs/
├── README.md                      # Index + dependency graph
│
├── core/                          # Core functionality (no UI)
│   ├── authentication.md
│   └── user-management.md
│
├── billing/                       # Features with UI → subdirectory
│   └── subscription/
│       ├── spec.md                # Phase 1A: requirements + AC
│       ├── ux.md                  # Phase 1B: user journey + wireframes
│       └── ui/
│           ├── prototype.html     # Phase 1C: static HTML prototype
│           └── notes.md
│
└── ui/                            # Purely UI features
    └── dashboard/
        ├── spec.md
        ├── ux.md
        └── ui/
            └── prototype.html
```

**Rule**: If a spec has no UX/UI artifacts, keep it as a single `.md` file. Only create a subdirectory when Phase 1B or 1C artifacts exist.

**Naming**: `kebab-case.md`

---

## Spec Template

```markdown
# [Feature/System Name]

| Field | Value |
|-------|-------|
| **Status** | Draft / Active / Deprecated / Superseded |
| **Created** | YYYY-MM-DD |
| **Updated** | YYYY-MM-DD |
| **Author** | Name |
| **Depends on** | [Other Spec](./other-spec.md) (optional) |
| **Supersedes** | [Old Spec](./old-spec.md) (optional) |

## Summary

One or two paragraphs describing what this feature/system does and why it exists.
Should be understandable by non-technical stakeholders.

## Goals

1. **Goal 1**: Description
2. **Goal 2**: Description

## Non-Goals

- What is explicitly out of scope
- What is covered by other specs
- What is deferred to future work

---

## Context

### Background

Why does this feature exist? What problem does it solve?

### Related Systems

- **[System A](./system-a.md)**: How it relates
- **[System B](./system-b.md)**: Dependencies or interactions

### Assumptions

- Assumption 1
- Assumption 2

### Constraints

- Technical constraints
- Business constraints

---

## Requirements

### Functional Requirements

1. **REQ-1**: [Short title]
   - The system MUST ...
   - Use RFC 2119 keywords: MUST, MUST NOT, SHOULD, SHOULD NOT, MAY

2. **REQ-2**: [Short title]
   - Description

### Non-Functional Requirements

1. **NFR-1**: [Performance]
   - Specific measurable requirement

2. **NFR-2**: [Security]
   - Security requirement

---

## Acceptance Criteria

- **AC-1**: [Testable criterion]
  - Can be verified by: [test approach]

- **AC-2**: [Testable criterion]
  - Can be verified by: [test approach]

---

## Technical Design (Optional)

### Architecture

High-level description. Only include if relevant to understanding requirements.

### Data Model

Relevant data structures or schemas.

### API / Interface

If this spec defines an API or interface, document it here.

### Edge Cases

- Edge case 1
- Edge case 2

### Error Handling

- Error type 1 → Response
- Error type 2 → Response

---

## Implementation Notes (Optional)

Hints for developers — NOT requirements. The developer chooses the implementation.

- Suggested libraries or tools
- Performance considerations
- Known gotchas

---

## Related Specs

- **[Other Spec](./other-spec.md)**: Relationship description

---

## Open Questions (Optional)

- [ ] Question 1 (remove when resolved)

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | YYYY-MM-DD | Initial version | Name |
```

---

## Writing Style

### Use RFC 2119 Keywords

- **MUST** / **MUST NOT**: Absolute requirement / prohibition
- **SHOULD** / **SHOULD NOT**: Recommended / not recommended
- **MAY**: Optional

### Be Specific and Measurable

```markdown
❌ "The system should be fast"
✅ "API calls MUST respond within 100ms (p95)"

❌ "Users can create some channels"
✅ "Users can create up to 50 channels per workspace"
```

### Goals Are Outcomes, Not Implementations

```markdown
❌ "Use bcrypt with cost factor 12"
✅ "Passwords MUST be securely hashed and verified"
   - Implementation note: Consider bcrypt with cost factor 12
```

### Acceptance Criteria Are Independently Testable

Each AC must:
- Be verifiable without reading other ACs
- Have a concrete, observable outcome
- Map to at least one test scenario

```markdown
❌ "Auth works well"
✅ "User can authenticate with email/password and receive a session token"
```

---

## Checklist — Before Marking a Spec Active

**Completeness:**
- [ ] All required sections are present
- [ ] Metadata table is complete (status, created, author)
- [ ] Summary is clear and concise
- [ ] Goals and Non-Goals are defined
- [ ] Requirements are numbered and specific
- [ ] Acceptance criteria are testable

**Clarity:**
- [ ] No vague terms ("fast", "good", "easy")
- [ ] All acronyms are defined
- [ ] Terminology is consistent with other specs

**Testability:**
- [ ] Every acceptance criterion can be independently verified
- [ ] Edge cases are identified

**Coherence:**
- [ ] No conflicts with other specs
- [ ] Dependencies are documented
- [ ] Related specs are linked

**Maintainability:**
- [ ] Changelog is present
- [ ] Status is set correctly
