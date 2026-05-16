# Worklog Format

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Author** | Pablo López Torres / Alice Evergreen |

---

## What is a Worklog?

A worklog is a **log of a working session**. It captures decisions, context, and progress that don't fit neatly into a spec or runbook — the "why we went down this path" and "what we found along the way."

Worklogs are informal. They are written for future-you and for teammates who need to understand the context of a decision. They do not need to be polished.

---

## When to Write a Worklog

Write a worklog when:
- You're exploring a problem space and want to capture your findings
- You made a non-obvious architectural decision and want to document the reasoning
- You spent significant time debugging and want to capture what you learned
- You're working on a long-running task across multiple sessions

Do NOT write a worklog for:
- Routine tasks that are already captured in a spec or runbook
- Things that belong in a commit message or PR description
- Meeting notes (keep those in a separate system)

---

## File Naming Convention

```
YYYY-MM-DD_topic-in-kebab-case.md
```

**Examples:**
```
2026-03-15_exploring-websocket-reconnection.md
2026-04-02_debugging-auth-token-expiry.md
2026-05-10_designing-notification-system.md
```

**Location:** `/docs/worklogs/` (or project-equivalent)

---

## Worklog Template

```markdown
# Worklog — [Topic]

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Author** | name |
| **Duration** | ~Xh |
| **Related to** | [spec / runbook / issue / task] |

---

## Context

Why did this session happen? What problem were you trying to solve?

---

## Work Log

### [HH:MM] — What you did

Description of what you did, decisions made, why.

```
# Relevant commands (optional)
```

### [HH:MM] — Next block of work

...

---

## Decisions Made

| Decision | Alternatives Considered | Reason |
|----------|------------------------|--------|
| ... | ... | ... |

---

## Problems Found

- **Problem**: description
  - **Solution**: how it was resolved
  - **Still open**: what remains unresolved

---

## Next Steps

- [ ] Pending action 1
- [ ] Pending action 2

---

## References

- [Related spec](../specs/...)
- [Related runbook](../runbooks/...)
```

---

## Tips

- Write as you go, not after the fact. A worklog written in real time is 10x more useful than one reconstructed from memory.
- Don't worry about polish. Bullet points, fragments, and informal language are fine.
- Capture the dead ends. "We tried X and it didn't work because Y" is often the most valuable thing in a worklog.
- Link to everything: specs, runbooks, commits, issues, conversations.

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-05-16 | Initial version | Pablo López Torres |
