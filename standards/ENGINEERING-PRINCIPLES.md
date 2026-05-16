# Engineering Principles

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Author** | Pablo López Torres / Alice Evergreen |

---

## Purpose

These are the engineering principles that govern how we build software. They are not guidelines — they are rules. They apply to all code, all contributors, and all projects.

When a proposed solution conflicts with these principles, the solution must be revised — not the principles.

---

## 1. Architecture First, Implementation Second

**Design the architecture. Then implement it. Never the other way around.**

Before writing any implementation:
1. The architecture for the feature or change must be defined and documented.
2. The implementation must be consistent with the defined architecture.
3. If implementation requires deviating from the architecture, the architecture must be explicitly revised first — not silently bypassed.

**Corollary: respect the existing architecture.**

If the architecture defines a specific mechanism for something, that mechanism must be used. Proposing or implementing an alternative — even a simpler one — without first revising the architecture is a violation of this principle.

**Examples of violations:**
- Adding a REST endpoint in a WebSocket-first system without revising the transport layer spec
- Implementing user-level ownership in a workspace-scoped system without updating the data model
- Adding a caching layer that bypasses the canonical data source without documenting the invalidation strategy

---

## 2. No Fallbacks — Do It or Fail

**There are no silent fallbacks.**

A fallback is any code path that silently substitutes a different behavior when the expected input or state is missing. Fallbacks hide bugs, produce incorrect results, and make the system unpredictable.

**The rule:** if something is missing or invalid, fail explicitly. Do not guess. Do not substitute. Do not degrade gracefully.

```typescript
// ❌ WRONG — silent fallback
const workspaceId = agentWorkspaceId || requestWorkspaceId || undefined
if (!workspaceId) {
  return db.items.find({}) // falls back to unscoped query
}

// ✅ CORRECT — fail explicitly
if (!workspaceId) {
  throw new Error(`[getItems] workspaceId is required. context: ${JSON.stringify(ctx)}`)
}
return db.items.find({ workspaceId })
```

**What counts as a fallback (forbidden):**
- `|| defaultValue` on values that should always be present
- `try/catch` that swallows errors and returns a degraded result
- Returning empty arrays instead of throwing when a required resource is missing
- Optional parameters that silently change behavior when absent

**What is NOT a fallback (acceptable):**
- Explicit default values for genuinely optional configuration (e.g. pagination page size)
- Returning `null` from a query when the caller explicitly handles the not-found case
- Retry logic with explicit limits and documented failure modes

---

## 3. Fail Fast, Fail Loud

**Errors must explode at the point of origin, not propagate silently.**

The earlier an error is caught, the cheaper it is to fix. An error caught at the boundary costs nothing. The same error discovered three hours later in production costs everything.

**Rules:**
- Validate inputs at the entry point of every function that has required parameters
- Throw immediately when a required value is missing or invalid — do not pass `undefined` downstream
- Error messages must be specific: include the function name, the missing field, and any available context (IDs, values)
- Never catch an error just to re-throw a generic one — preserve the original message and context

```typescript
// ❌ WRONG
async function processOrder(orderId: string, userId?: string) {
  const effective = userId ?? undefined
  // userId might be undefined — wrong behavior propagates downstream
}

// ✅ CORRECT
async function processOrder(orderId: string, userId: string) {
  if (!userId) {
    throw new Error(`[processOrder] userId is required. orderId: ${orderId}`)
  }
  // safe to proceed
}
```

---

## 4. Strict Interfaces — Required Means Required

**If a field is required, it is not optional in the type signature.**

Using `?` on a field that must always be present is a lie in the type system. It forces every caller to handle the undefined case and allows callers to omit the field without a compile-time error.

**Rules:**
- Required fields are non-optional in TypeScript interfaces and function signatures
- Required fields are validated at runtime at the entry point (in addition to compile-time types)
- If a field is genuinely optional, document explicitly what the behavior is when it is absent

```typescript
// ❌ WRONG
interface CreateOrderParams {
  productId: string
  userId?: string  // "optional" but actually always required
}

// ✅ CORRECT
interface CreateOrderParams {
  productId: string
  userId: string  // required, always
}
```

---

## 5. Data Writes Are Contracts

**No record is written to a database without shape validation.**

Schema-less databases (MongoDB, Firestore, DynamoDB) are footguns. Treat every write as a typed contract. Writing a document without validating its shape is forbidden.

**Rules:**
- Every collection/table has a TypeScript interface that defines its complete shape
- Every write function validates the document against its interface before persisting
- Required fields must be validated at write time — if missing, the write must throw
- No `as any` casts on documents being written to the database

```typescript
// ❌ WRONG
async function createUser(data: any) {
  await db.collection('users').insertOne(data)
}

// ✅ CORRECT
async function createUser(data: CreateUserInput): Promise<User> {
  if (!data.email) throw new Error('[createUser] email is required')
  if (!data.name) throw new Error('[createUser] name is required')

  const doc: User = {
    userId: generateId(),
    email: data.email,
    name: data.name,
    createdAt: new Date().toISOString(),
  }
  await db.collection('users').insertOne(doc)
  return doc
}
```

---

## 6. Ownership Is Explicit

**Every resource belongs to exactly one owner. There are no ownerless resources.**

This is a specific application of the principles above. The most common source of data integrity bugs is resources that can belong to multiple owners or no owner at all.

**Rules:**
- Every resource document must have a clear ownership field (e.g. `userId`, `workspaceId`, `orgId`)
- Ownership is set at creation time and validated — never inferred or defaulted silently
- Queries for resources always include the ownership scope — never return unscoped results
- Cross-ownership operations (e.g. sharing, delegation) are explicit features with their own specs, not implicit behaviors

```typescript
// ❌ WRONG — ownership can be missing
const items = await db.items.find({ type: 'document' })

// ✅ CORRECT — always scoped to owner
if (!ownerId) {
  throw new Error('[getItems] ownerId is required')
}
const items = await db.items.find({ ownerId, type: 'document' })
```

---

## Summary

| Principle | Rule |
|-----------|------|
| Architecture First | Design before implementing. Implementations must match the architecture. |
| No Fallbacks | Do it or fail. No silent substitutions. |
| Fail Fast, Fail Loud | Errors explode at the point of origin with specific messages. |
| Strict Interfaces | Required fields are required in types and validated at runtime. |
| Data Writes Are Contracts | Validate shape before every write. No incomplete documents. |
| Ownership Is Explicit | Every resource has an owner. Queries are always scoped. |

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-05-16 | Initial version | Pablo López Torres |
