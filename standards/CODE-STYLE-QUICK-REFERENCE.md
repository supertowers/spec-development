# Code Style — Quick Reference

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Created** | 2026-05-16 |
| **Updated** | 2026-05-16 |
| **Author** | Pablo López Torres / Alice Evergreen |

> This is the TL;DR version of [`CODE-STYLE.md`](./CODE-STYLE.md). Read the full document for rationale, examples, and edge cases.

---

## Language

- All code, comments, docs, and commit messages: **English only**

---

## Formatting (enforced by Biome)

| Rule | Value |
|------|-------|
| Semicolons | ❌ None |
| Quotes | `"double"` (backticks for template literals) |
| Indentation | 2 spaces |
| Trailing commas | ✅ Always in multi-line arrays/objects/params |
| Line length | 100 chars max |
| Brace style | Same line (`if (x) {`) |

---

## Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| Variables / functions | `camelCase` | `getUserById` |
| Classes / types / interfaces | `PascalCase` | `UserProfile` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES` |
| Files | `kebab-case` | `user-profile.ts` |
| React components | `PascalCase` file + export | `UserCard.tsx` |
| CSS classes | `kebab-case` | `user-card` |
| Boolean vars | `is/has/can/should` prefix | `isLoading`, `hasError` |

---

## TypeScript

- Always declare return types on exported functions
- Prefer `interface` over `type` for object shapes
- No `any` — use `unknown` and narrow, or define a proper type
- Required fields are **not optional** in type signatures (`?` = genuinely optional)
- Use `const` by default; `let` only when reassignment is needed; never `var`

---

## Functions

- Max ~30 lines per function — extract if longer
- Max 3-4 parameters — use an options object beyond that
- Single responsibility: one function does one thing
- Pure functions preferred — minimize side effects

---

## Error Handling

- Validate required inputs at the entry point of every function
- Throw with specific messages: `[functionName] fieldName is required. context: ...`
- Never swallow errors with empty `catch` blocks
- Never re-throw a generic error — preserve the original message

---

## Imports

- Absolute imports over relative for cross-package imports
- Group: external → internal → relative (blank line between groups)
- No unused imports (Biome enforces this)

---

## Core Principles (non-negotiable)

1. **DRY** — if logic appears in 2+ places, extract it before adding a third
2. **No deprecated code** — delete old versions, update all call sites in the same PR
3. **No fallbacks** — if something is missing, throw; don't silently substitute
4. **Readability first** — optimize for the reader, not the writer

---

## Commit Messages (Conventional Commits)

```
feat: add user authentication
fix: resolve session token expiry bug
refactor: extract pagination logic to shared hook
docs: update API reference for auth endpoint
test: add acceptance tests for subscription flow
chore: upgrade Biome to 1.8.0
```

Format: `<type>(<optional scope>): <description>`

---

## Checklist Before Opening a PR

- [ ] `biome check` passes with no errors
- [ ] No `any` types introduced
- [ ] No duplicated logic (DRY)
- [ ] No deprecated wrappers left behind
- [ ] All new functions have return types
- [ ] Error messages are specific and include context
- [ ] Commit messages follow Conventional Commits

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-05-16 | Initial version | Pablo López Torres / Alice Evergreen |
