# How We Work — Engineering Standards

This directory contains our **project-agnostic engineering standards**. These apply to every project we build, regardless of stack, size, or team composition.

Think of this as a portable skill set: import it into any project and you immediately have a shared language for how to spec, build, test, review, and ship software.

---

## Contents

```
spec-development/
│
├── standards/                         ← Principles and rules (the "what")
│   ├── ENGINEERING-PRINCIPLES.md      ← Core rules that govern every technical decision
│   ├── CODE-STYLE.md                  ← TypeScript/JS code style (full reference)
│   ├── CODE-STYLE-QUICK-REFERENCE.md  ← TL;DR version of CODE-STYLE.md
│   ├── TESTING.md                     ← BDD/Gherkin testing guide
│   ├── DESIGN-PRINCIPLES.md           ← UI/UX design principles
│   └── GLOSSARY.md                    ← Definitions of all terms used in this repo
│
├── process/                           ← Workflows and procedures (the "how")
│   ├── SPEC-DRIVEN-WORKFLOW.md        ← How to develop any feature (SDD)
│   ├── SPEC-FORMAT.md                 ← How to write a spec
│   ├── RUNBOOK-FORMAT.md              ← How to write a runbook
│   └── WORKLOG-FORMAT.md              ← How to write a worklog
│
└── templates/                         ← Copy-paste starting points
    ├── spec.md                        ← Blank spec template
    ├── runbook.md                     ← Blank runbook template
    ├── worklog.md                     ← Blank worklog template
    └── specs-index.md                 ← Blank specs index for a new project
```

---

## The Three Pillars

### 1. Spec-Driven Development
Every feature starts with a spec. The spec is the source of truth. Tests validate the spec. Code implements the spec. → [`process/SPEC-DRIVEN-WORKFLOW.md`](./process/SPEC-DRIVEN-WORKFLOW.md)

### 2. Engineering Principles
A small set of non-negotiable rules that prevent the most common classes of bugs and architectural drift. → [`standards/ENGINEERING-PRINCIPLES.md`](./standards/ENGINEERING-PRINCIPLES.md)

### 3. Design Consistency
UI and UX decisions follow a documented system so every surface feels intentional and coherent. → [`standards/DESIGN-PRINCIPLES.md`](./standards/DESIGN-PRINCIPLES.md)

---

## Reading Order

If you're new here, read in this order:

1. **[`standards/ENGINEERING-PRINCIPLES.md`](./standards/ENGINEERING-PRINCIPLES.md)** — start here. These are the non-negotiable rules that govern every decision.
2. **[`standards/GLOSSARY.md`](./standards/GLOSSARY.md)** — learn the vocabulary used across all documents.
3. **[`process/SPEC-DRIVEN-WORKFLOW.md`](./process/SPEC-DRIVEN-WORKFLOW.md)** — understand the full development lifecycle before writing a single line of code.
4. **[`process/SPEC-FORMAT.md`](./process/SPEC-FORMAT.md)** — learn how to write a spec correctly.
5. **[`standards/CODE-STYLE-QUICK-REFERENCE.md`](./standards/CODE-STYLE-QUICK-REFERENCE.md)** — code conventions at a glance. See [`CODE-STYLE.md`](./standards/CODE-STYLE.md) for the full reference.
6. **[`standards/TESTING.md`](./standards/TESTING.md)** — BDD/Gherkin testing guide.
7. **[`standards/DESIGN-PRINCIPLES.md`](./standards/DESIGN-PRINCIPLES.md)** — only relevant if your feature has a UI.
8. **[`process/RUNBOOK-FORMAT.md`](./process/RUNBOOK-FORMAT.md)** and **[`process/WORKLOG-FORMAT.md`](./process/WORKLOG-FORMAT.md)** — reference as needed when running procedures or logging work.

---

## How to use this in a new project

1. Copy this directory into your project (or reference it as a shared resource)
2. Read `standards/ENGINEERING-PRINCIPLES.md` — these are non-negotiable
3. When starting a feature, follow `process/SPEC-DRIVEN-WORKFLOW.md`
4. Use the templates in `templates/` as starting points
5. Add project-specific docs alongside these (don't modify the standards themselves)
