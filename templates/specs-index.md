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

| Spec | Status | Description | Depends On |
|------|--------|-------------|------------|
| [core/authentication](./core/authentication.md) | Active | User authentication via email/password and session tokens | — |
| [core/user-management](./core/user-management.md) | Active | Create, update, and deactivate user accounts | [authentication](./core/authentication.md) |
| [billing/subscription](./billing/subscription/spec.md) | Draft | Subscription plans, upgrades, and cancellations | [authentication](./core/authentication.md) |
| [ui/dashboard](./ui/dashboard/spec.md) | Draft | Main dashboard with activity feed and quick actions | [core/user-management](./core/user-management.md) |

> **Status values**: `Draft` → `Active` → `Deprecated` → `Superseded`

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
4. Add it to the table above with status `Draft`
5. Document its dependencies

See [`process/SPEC-FORMAT.md`](../../process/SPEC-FORMAT.md) for the full spec format guide.
