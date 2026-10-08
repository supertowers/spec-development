# Specs Index

| Field | Value |
|-------|-------|
| **Project** | [Project Name] |
| **Updated** | YYYY-MM-DD |

---

## Overview

This file is the entry point for all specifications in this project. It lists every spec, its current status, and its dependencies.

---

## Specs

| Key | Spec | Status | Description | Depends On |
|-----|------|--------|-------------|------------|
| AUTH | [core/authentication](./core/authentication.md) | implemented | User authentication via email/password and session tokens | — |
| USER | [core/user-management](./core/user-management.md) | implemented | Create, update, and deactivate user accounts | AUTH |
| SUB | [billing/subscription](./billing/subscription/spec.md) | approved | Subscription plans, upgrades, and cancellations | AUTH |
| DASH | [ui/dashboard](./ui/dashboard/spec.md) | draft | Main dashboard with activity feed and quick actions | USER |

> **Status values**: `draft` → `approved` → `implemented` → `deprecated`. The frontmatter of each spec is the source of truth; this table mirrors it.

---

## Traceability Health

| Date | `spec-check` baseline | Specs implemented / total | Last full audit | Notes |
|------|-----------------------|---------------------------|-----------------|-------|
| YYYY-MM-DD | 0 | 2 / 4 | YYYY-MM-DD | |

Audit reports live in [`_audits/`](./_audits/). The generated traceability matrix lives in `_generated/matrix.md`.

---

## Dependency Graph

```
authentication
    └── user-management
    └── subscription
            └── (no dependents yet)
    └── dashboard
            └── (no dependents yet)
```

---

## Namespaces

| Namespace | Description |
|-----------|-------------|
| `core/` | Core functionality with no UI (auth, users, permissions) |
| `billing/` | Subscription and payment features |
| `ui/` | Purely UI features (dashboards, settings screens) |

---

## Adding a New Spec

1. Pick the right namespace (or create a new one if needed)
2. If the feature has no UI: create a single `.md` file → `docs/specs/{namespace}/{feature}.md`
3. If the feature has UI: create a subdirectory → `docs/specs/{namespace}/{feature}/spec.md`
4. Pick a unique spec key and set it as `id` in the frontmatter
5. Add it to the table above with status `draft`
6. Document its dependencies in `depends_on`
7. Get human approval before any test or code references it

See [`process/SPEC-FORMAT.md`](../../process/SPEC-FORMAT.md) for the full spec format guide.
