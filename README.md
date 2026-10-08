# spec-development

> **A portable engineering system.** Drop it into any project and instantly have a shared language for how to spec, build, test, review, and ship software.

---

## What this is

A self-contained set of standards, workflows, and templates that travels with your team across every project — regardless of stack, size, or composition.

No opinions about your framework. No dependency on your toolchain. Just the process layer that sits above all of it.

---

## The three pillars

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   SPEC             TEST              CODE             TRACE         │
│                                                                     │
│   Write what       Verify the        Implement        Prove both    │
│   the system       spec is           until tests      directions:   │
│   must do.         satisfied.        pass.            spec ⇄ code.  │
│                                                                     │
│   → spec.md        → tests           → production     → spec-check │
│                                                         + audits    │
└─────────────────────────────────────────────────────────────────────┘

         The spec is the source of truth.
         Tests validate the spec.
         Code implements the spec.
         Nothing exists in the code that the spec did not ask for.
```

The fourth pillar is what makes this safe for AI-written code. Agents are good at adding plausible behavior nobody asked for: a fallback here, a convenience flag there. Every requirement has a stable ID, every public entry point in the code names the ID it implements, a zero-dependency checker enforces those links on every commit, and a periodic audit checks that the links are true. See [`process/TRACEABILITY.md`](./process/TRACEABILITY.md).

---

## Contents

```
spec-development/
│
├── standards/                         ← The rules (non-negotiable)
│   ├── ENGINEERING-PRINCIPLES.md      ← 6 principles that prevent the most common bugs
│   ├── CODE-STYLE-QUICK-REFERENCE.md  ← Code conventions at a glance
│   ├── CODE-STYLE.md                  ← Full code style reference
│   ├── TESTING.md                     ← BDD/Gherkin testing guide
│   ├── DESIGN-PRINCIPLES.md           ← UI/UX design system
│   └── GLOSSARY.md                    ← Every term, defined precisely
│
├── process/                           ← The workflow (how work gets done)
│   ├── SPEC-DRIVEN-WORKFLOW.md        ← The full SDD lifecycle
│   ├── TRACEABILITY.md                ← IDs, @spec annotations, spec-check, rules for agents
│   ├── SPEC-AUDIT.md                  ← Periodic semantic drift audit
│   ├── BROWNFIELD-ADOPTION.md         ← Bringing an existing codebase under the protocol
│   ├── AGENT-ROLES.md                 ← Agent roles and boundaries for agentic development
│   ├── DEVELOPMENT-LOOPS.md           ← The 5 nested loops + metrics + improvement cycle
│   ├── SPEC-FORMAT.md                 ← How to write a spec
│   ├── RUNBOOK-FORMAT.md              ← How to document a procedure
│   └── WORKLOG-FORMAT.md              ← How to log work in progress
│
├── templates/                         ← Copy-paste starting points
│   ├── spec.md                        ← Blank spec
│   ├── specs-index.md                 ← Blank specs index for a new project
│   ├── agent-instructions.md          ← Rules to paste into CLAUDE.md / AGENTS.md
│   ├── spec-check.config.json         ← Starting config for the checker
│   ├── ci/spec-check.yml              ← GitHub Actions job
│   ├── runbook.md                     ← Blank runbook
│   └── worklog.md                     ← Blank worklog
│
├── tools/
│   └── spec-check.mjs                 ← Zero-dependency traceability checker (Node ≥ 18)
│
└── agents/
    └── spec-auditor.md                ← Audit Agent, Claude Code subagent format
```

---

## Reading order

New here? Read in this order — each document builds on the previous one.

| # | Document | Why |
|---|----------|-----|
| 1 | [`standards/ENGINEERING-PRINCIPLES.md`](./standards/ENGINEERING-PRINCIPLES.md) | The non-negotiable rules. Start here. |
| 2 | [`standards/GLOSSARY.md`](./standards/GLOSSARY.md) | Learn the vocabulary before reading anything else. |
| 3 | [`process/SPEC-DRIVEN-WORKFLOW.md`](./process/SPEC-DRIVEN-WORKFLOW.md) | Understand the full lifecycle before writing a line of code. |
| 4 | [`process/TRACEABILITY.md`](./process/TRACEABILITY.md) | How every line of code stays tied to a requirement. |
| 5 | [`process/SPEC-FORMAT.md`](./process/SPEC-FORMAT.md) | Learn how to write a spec correctly. |
| 6 | [`process/AGENT-ROLES.md`](./process/AGENT-ROLES.md) | How the workflow is executed by specialized agents. |
| 7 | [`process/SPEC-AUDIT.md`](./process/SPEC-AUDIT.md) | The periodic check that specs and code still agree. |
| 8 | [`process/DEVELOPMENT-LOOPS.md`](./process/DEVELOPMENT-LOOPS.md) | The 5 nested feedback loops and how to measure improvement. |
| 9 | [`standards/CODE-STYLE-QUICK-REFERENCE.md`](./standards/CODE-STYLE-QUICK-REFERENCE.md) | Code conventions at a glance. |
| 10 | [`standards/TESTING.md`](./standards/TESTING.md) | BDD/Gherkin — how to write scenarios that actually work. |
| 11 | [`standards/DESIGN-PRINCIPLES.md`](./standards/DESIGN-PRINCIPLES.md) | Only if your feature has a UI. |
| 12 | [`process/BROWNFIELD-ADOPTION.md`](./process/BROWNFIELD-ADOPTION.md) | Only if you are adopting this in an existing codebase. |
| 13 | [`process/RUNBOOK-FORMAT.md`](./process/RUNBOOK-FORMAT.md) · [`process/WORKLOG-FORMAT.md`](./process/WORKLOG-FORMAT.md) | Reference as needed. |

---

## How to use this in a new project

```bash
# Option A — copy directly
cp -r spec-development/ your-project/

# Option B — git subtree
git subtree add --prefix spec-development \
  https://github.com/supertowers/spec-development master --squash
```

Then:

1. Read `standards/ENGINEERING-PRINCIPLES.md` — these are non-negotiable
2. Copy `templates/specs-index.md` → `docs/specs/README.md` and fill it in
3. Copy `tools/spec-check.mjs` → `tools/`, and `templates/spec-check.config.json` → project root. Declare your project's surface patterns.
4. Copy `templates/ci/spec-check.yml` → `.github/workflows/` and make it a required check
5. Paste `templates/agent-instructions.md` into your `CLAUDE.md` / `AGENTS.md`
6. Copy `agents/spec-auditor.md` → `.claude/agents/` and schedule the audit
7. When starting a feature, follow `process/SPEC-DRIVEN-WORKFLOW.md`
8. Add project-specific docs alongside these — don't modify the standards themselves

Existing codebase? Follow [`process/BROWNFIELD-ADOPTION.md`](./process/BROWNFIELD-ADOPTION.md) instead of step 3 alone.

### Running the checker

```bash
node tools/spec-check.mjs                     # exit 1 on new violations
node tools/spec-check.mjs --matrix matrix.md  # write the traceability matrix
node tools/spec-check.mjs --update-baseline   # lock in fixed violations
node --test tools/test/*.test.mjs             # the checker's own tests
```

---

## The agents

Every feature is built by four specialized agents and checked by a fifth. Each agent owns one or more workflow roles and has strict boundaries to prevent bias and ensure quality.

| Agent | Workflow Roles | What it does |
|-------|---------------|-------------|
| **Spec Agent** | Spec Manager, Validator | Writes and owns specs. Ensures system-wide coherence. Source of truth. |
| **UX Agent** | UX Designer, UI Designer | User journey + wireframes + static prototypes. *(UI features only)* |
| **QA Agent** | Test Writer | Acceptance tests in Gherkin. Black box — never reads source code. |
| **Dev Agent** | Developer, Code Reviewer | Implements until tests pass. **Never touches `.feature` files.** Annotates every entry point with its requirement ID. |
| **Audit Agent** | Validator | Compares specs with code and tests in both directions. Read-only. Reports drift for a human to decide. |

A sixth agent (**Process Agent**) is planned for continuous improvement of the methodology itself.

Two decisions are reserved for a **human**: approving a spec, and deciding what to do with each drift finding. No agent may authorize scope.

The key separation: **QA writes the tests, Dev writes the code.** Dev never touches acceptance tests. QA never reads source code. This eliminates the bias where developers test what they built instead of what the user needs.

See [`process/AGENT-ROLES.md`](./process/AGENT-ROLES.md) for full role definitions, boundaries, and communication protocols.

---

## The six workflow roles

The agents above implement six underlying roles. One agent can cover multiple roles.

| Role | Phase | Responsibility |
|------|-------|---------------|
| 📋 **Spec Manager** | 1A, 5 | Writes and owns the spec. Source of truth. |
| 🗺️ **UX Designer** | 1B | User journey + ASCII wireframes. *(UI features only)* |
| 🎨 **UI Designer** | 1C | Static HTML/CSS prototype. *(UI features only)* |
| 🧪 **Test Writer** | 2 | Acceptance tests in Gherkin. Documentation first. |
| 👨‍💻 **Developer** | 3 | Implements until all tests pass. |
| 🏗️ **Code Reviewer** | 4–5 | Architecture, coherence, no duplication. |

---

## Contributing

Changes to these standards are rare, deliberate, and backward-compatible.

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full process.

---

*Built by Pablo López Torres & Alice Evergreen.*
