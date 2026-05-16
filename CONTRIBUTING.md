# Contributing to spec-development

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Author** | Pablo López Torres / Alice Evergreen |

---

## Overview

This repo contains shared engineering standards. They are designed to be stable and project-agnostic — not changed lightly. This document explains how to propose, discuss, and apply changes.

---

## Guiding Principle

> These documents are standards, not suggestions. Changes should be rare, deliberate, and backward-compatible wherever possible.

If you find yourself wanting to change a standard to fit a specific project's needs, the answer is almost always to add a project-specific document alongside these — not to modify the standard itself.

---

## What can be changed

| Type | Examples | Process |
|------|----------|---------|
| **Clarification** | Fix ambiguous wording, add a missing example | PR with a short description |
| **Addition** | New section, new rule, new template | PR + discussion with at least one other person |
| **Modification** | Change an existing rule or workflow step | PR + discussion + explicit sign-off |
| **Removal** | Delete a rule or section | PR + discussion + explicit sign-off + note in Changelog |

---

## How to propose a change

1. **Open a PR** with the proposed change.
2. **Describe why** — not just what changed, but why the current version is insufficient.
3. **Tag at least one other person** for review.
4. **Update the Changelog** of the affected document(s) with the new version and a summary of the change.
5. **Bump the version** following semver:
   - `patch` (x.x.**1**) — clarifications, typos, examples
   - `minor` (x.**1**.0) — additions that don't break existing behavior
   - `major` (**2**.0.0) — changes to existing rules or removal of content

---

## What not to do

- **Don't modify standards to work around a project-specific constraint.** Add a local override doc in your project instead.
- **Don't make changes without updating the Changelog.** Undocumented changes make it impossible to understand why something is the way it is.
- **Don't remove content without a discussion.** Even if something seems outdated, others may depend on it.

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-05-16 | Initial version | Pablo López Torres / Alice Evergreen |
