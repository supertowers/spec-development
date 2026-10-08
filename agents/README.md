# Agents

Ready-made agent definitions for the roles described in [`process/AGENT-ROLES.md`](../process/AGENT-ROLES.md).

| File | Role | Format |
|------|------|--------|
| [`spec-auditor.md`](./spec-auditor.md) | Audit Agent | Claude Code subagent |

## Installing in a project

```bash
mkdir -p .claude/agents
cp spec-development/agents/spec-auditor.md .claude/agents/
```

The definitions use the Claude Code subagent format: YAML frontmatter with `name`, `description` and `tools`, followed by the system prompt. The prompt body is plain text and works with any agent runtime that accepts a system prompt.
