<!--
  Template — paste into the project's agent instructions file (CLAUDE.md, AGENTS.md, …).
  Source: process/TRACEABILITY.md, section "Rules for Agents".
-->

## Spec-Driven Development

This project follows spec-driven development with bidirectional traceability.
Specs live in `docs/specs/`. The protocol is in `spec-development/process/TRACEABILITY.md`.

**No ID, no code.** Every behavior traces to an approved requirement ID such as `INV-REQ-3`.

1. Before writing code, name the requirement IDs you are implementing. If you cannot, stop and say the work is not specified.
2. Only implement specs whose frontmatter status is `approved` or `implemented`. Never implement against a `draft`.
3. Never edit a spec to match code you just wrote. Report the gap instead, quoting the requirement.
4. Never add behavior no requirement asks for: no extra fallbacks, retries, flags, fields, defaults or endpoints. Propose a requirement instead.
5. Annotate every new public surface item with `@spec <ID>`. Put the AC ID in the title of every acceptance test: `it('[INV-AC-1] …')`.
6. Never add entries to `spec-check.baseline.json` or to the `exempt` list in `spec-check.config.json` unless explicitly told to.
7. Run `node tools/spec-check.mjs` before declaring work complete. New violations mean the work is not complete.
8. Every pull request description has a `Specs:` line listing the IDs added, changed, retired, or `none (no behavior change)`.
