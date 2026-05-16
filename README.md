# How We Work — Engineering Standards

This directory contains our **project-agnostic engineering standards**. These apply to every project we build, regardless of stack, size, or team composition.

Think of this as a portable skill set: import it into any project and you immediately have a shared language for how to spec, build, test, review, and ship software.

---

## Contents

```
spec-development/
│
├── standards/                    ← Principles and rules (the "what")
│   ├── ENGINEERING-PRINCIPLES.md ← Core rules that govern every technical decision
│   ├── CODE-STYLE.md             ← TypeScript/JS code style
│   ├── TESTING.md                ← BDD/Gherkin testing guide
│   └── DESIGN-SYSTEM.md          ← UI/UX design principles and tokens
│
├── process/                      ← Workflows and procedures (the "how")
│   ├── SPEC-DRIVEN-WORKFLOW.md   ← How to develop any feature (SDD)
│   ├── SPEC-FORMAT.md            ← How to write a spec
│   ├── RUNBOOK-FORMAT.md         ← How to write a runbook
│   └── WORKLOG-FORMAT.md         ← How to write a worklog
│
└── templates/                    ← Copy-paste starting points
    ├── spec.md                   ← Blank spec template
    ├── runbook.md                ← Blank runbook template
    └── worklog.md                ← Blank worklog template
```

---

## The Three Pillars

### 1. Spec-Driven Development
Every feature starts with a spec. The spec is the source of truth. Tests validate the spec. Code implements the spec. → [`process/SPEC-DRIVEN-WORKFLOW.md`](./process/SPEC-DRIVEN-WORKFLOW.md)

### 2. Engineering Principles
A small set of non-negotiable rules that prevent the most common classes of bugs and architectural drift. → [`standards/ENGINEERING-PRINCIPLES.md`](./standards/ENGINEERING-PRINCIPLES.md)

### 3. Design Consistency
UI and UX decisions follow a documented system so every surface feels intentional and coherent. → [`standards/DESIGN-SYSTEM.md`](./standards/DESIGN-SYSTEM.md)

---

## How to use this in a new project

1. Copy this directory into your project (or reference it as a shared resource)
2. Read `standards/ENGINEERING-PRINCIPLES.md` — these are non-negotiable
3. When starting a feature, follow `process/SPEC-DRIVEN-WORKFLOW.md`
4. Use the templates in `templates/` as starting points
5. Add project-specific docs alongside these (don't modify the standards themselves)
