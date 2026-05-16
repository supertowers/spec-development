# Code Style Guide

| Field | Value |
|-------|-------|
| **Version** | 1.2.0 |
| **Status** | Active |
| **Created** | 2026-02-04 |
| **Last Updated** | 2026-02-04 |
| **Author** | Pablo / Alice |

## Overview

This document defines the code style and conventions for our codebase. These rules are enforced by Biome and should be followed by all developers.

### Purpose

- Ensure consistency across the codebase
- Make code easier to read and maintain
- Reduce cognitive load when switching between files
- Enable effective code reviews
- Support automated formatting and linting

### Enforcement

- **Biome**: Automated formatting and linting (`biome.json`)
- **Pre-commit hooks**: Format on commit (future)
- **CI/CD**: Fail build on style violations (future)

---

## Language / Idioma

**RULE**: All code, comments, documentation, and commit messages MUST be in English

### Code

```typescript
// ✅ GOOD: English
function calculateTotal(items: CartItem[]): number {
  // Sum all item prices
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ❌ BAD: Spanish
function calcularTotal(items: ItemCarrito[]): number {
  // Sumar todos los precios
  return items.reduce((suma, item) => suma + item.precio, 0)
}
```

### Comments

```typescript
// ✅ GOOD: English comments
// Check if user has permission before proceeding
if (!hasPermission(user, 'write')) {
  throw new Error('Insufficient permissions')
}

// ❌ BAD: Spanish comments
// Verificar si el usuario tiene permiso antes de continuar
if (!hasPermission(user, 'write')) {
  throw new Error('Insufficient permissions')
}
```

### Documentation

- **Code documentation** (JSDoc, README files): English
- **Specifications**: English
- **Architecture documents**: English
- **User-facing content**: May be localized

### Commit Messages

```bash
# ✅ GOOD
git commit -m "feat: add user authentication"

# ❌ BAD
git commit -m "feat: añadir autenticación de usuario"
```

**Rationale**: 
- English is the universal language for software development
- Enables collaboration with international developers
- Most libraries, frameworks, and tools use English
- Improves code searchability and maintainability

---

## Core Principles

### 1. Consistency Over Personal Preference

> **"The codebase should look like it was written by one person"**

Follow these guidelines even if you personally prefer a different style.

### 2. Readability First

> **"Code is read 10x more than it's written"**

Optimize for clarity and maintainability, not brevity.

### 3. Let Tools Handle Formatting

> **"Don't waste time on formatting debates"**

Use Biome to auto-format. Focus on logic, not spacing.

### 4. No Code Duplication (DRY)

> **"If you copy-paste code, you own two bugs instead of one"**

**RULE**: Do not duplicate logic. If the same code appears in two or more places, extract it — into a shared function, hook, component, or utility — before adding it a third time.

This applies especially when working with legacy codebases: discovering duplicated logic is a signal to refactor, not a reason to copy again.

```typescript
// ❌ BAD: Same animation logic copied across 17 renderer files
const pulseAnim = useRef(new Animated.Value(1)).current
useEffect(() => {
  const pulse = Animated.loop(Animated.sequence([
    Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
  ]))
  if (status === 'running') pulse.start()
  else { pulse.stop(); pulseAnim.setValue(1) }
}, [status, pulseAnim])

// ✅ GOOD: Extracted to a shared hook, used everywhere
const pulseAnim = usePulseAnimation(status === 'running')
```

**Rules**:
- If logic is used in 2+ places, extract it immediately
- Hooks for stateful/animated logic (`usePulseAnimation`, `useDebounce`, etc.)
- Utility functions for pure logic (`formatDate`, `truncate`, etc.)
- Shared components for repeated UI patterns (`AppSpinner`, `FullscreenLoader`, etc.)
- When you find duplication in existing code, fix it — don't perpetuate it

**Rationale**:
- Duplicated logic means bugs must be fixed in N places
- Changes to behavior (duration, easing, thresholds) require hunting every copy
- Reviewers cannot trust that all copies are in sync
- Legacy codebases accumulate duplication over time — each PR is an opportunity to reduce it

---

### 5. No Deprecated Code or Fallbacks

> **"Prefer failing fast over hiding debt"**

Do not leave deprecated code, compatibility shims, or fallback paths in the codebase. When replacing something, delete the old version entirely and update all call sites. If a consumer would break, update it in the same PR — don't leave a wrapper behind.

```typescript
// ❌ BAD: Deprecated wrapper left in place
/** @deprecated Use client.profile.getProfile() */
getProfile() {
  return this.profile.getProfile()
}

// ✅ GOOD: Delete the wrapper, update the call site
// ProfileWindowContent.tsx
const data = await client.profile.getProfile()
```

**Rationale**:
- Deprecated code is read and maintained indefinitely, even when unused
- Fallbacks mask failures that should surface immediately
- A clean break forces all consumers to be updated, preventing drift
- If something must be kept temporarily, it needs a concrete removal date as a `// TODO(#ticket)` comment

---

## Formatting Rules

### Semicolons

**RULE**: No semicolons

```typescript
// ✅ GOOD
const name = 'Alice'
const age = 25

function greet(name: string) {
  return `Hello, ${name}`
}

// ❌ BAD
const name = 'Alice';
const age = 25;

function greet(name: string) {
  return `Hello, ${name}`;
}
```

**Rationale**: Cleaner, less visual noise. JavaScript ASI (Automatic Semicolon Insertion) handles this correctly.

**Exception**: Rare cases where semicolon is needed to avoid ambiguity (Biome will warn)

```typescript
// Needed when line starts with [ or (
;[1, 2, 3].forEach(console.log)
```

---

### Trailing Commas

**RULE**: Always use trailing commas in multi-line arrays, objects, and function parameters

```typescript
// ✅ GOOD
const user = {
  name: 'Alice',
  age: 25,
  role: 'Developer', // ← Trailing comma
}

const colors = [
  'red',
  'green',
  'blue', // ← Trailing comma
]

function createUser(
  name: string,
  age: number,
  role: string, // ← Trailing comma
) {
  // ...
}

// ❌ BAD
const user = {
  name: 'Alice',
  age: 25,
  role: 'Developer' // ← Missing comma
}
```

**Rationale**:
- Cleaner git diffs (adding a line doesn't modify previous line)
- Easier to reorder lines
- Prevents forgotten commas when adding new items

---

### Quotes

**RULE**: Use double quotes for strings

```typescript
// ✅ GOOD
const name = "Alice"
const message = "Hello, world"

// ❌ BAD
const name = 'Alice'
const message = 'Hello, world'
```

**Exception**: Use backticks for template literals

```typescript
// ✅ GOOD
const greeting = `Hello, ${name}`
const multiline = `
  This is a
  multi-line string
`

// ❌ BAD (unnecessary template literal)
const name = `Alice` // No interpolation, use double quotes
```

---

### Indentation

**RULE**: 2 spaces for indentation

```typescript
// ✅ GOOD
function example() {
  if (condition) {
    doSomething()
  }
}

// ❌ BAD (4 spaces)
function example() {
    if (condition) {
        doSomething()
    }
}
```

**Rationale**: Standard in JavaScript ecosystem, saves horizontal space

---

### Line Length

**RULE**: Maximum 100 characters per line

```typescript
// ✅ GOOD
const message = 
  'This is a very long message that would exceed 100 characters if on one line'

// ❌ BAD
const message = 'This is a very long message that would exceed 100 characters if on one line so we should break it'
```

**Exception**: URLs, import paths, and other strings that can't be broken

---

### Line Breaks

**RULE**: Use line breaks to improve readability

**Object properties**:

**RULE**: Always use multiple lines for objects

```typescript
// ✅ GOOD: Always multi-line
const point = {
  x: 10,
  y: 20,
}

const user = {
  name: "Alice",
  email: "alice@teros.ai",
  role: "Developer",
}

// ❌ BAD: Inline objects
const point = { x: 10, y: 20 }
const user = { name: "Alice", email: "alice@teros.ai" }
```

**Rationale**: Consistent formatting, cleaner git diffs

---

## Naming Conventions

### Variables and Functions

**RULE**: Use camelCase

```typescript
// ✅ GOOD
const userName = 'Alice'
const isActive = true
const channelId = 'ch_123'

function sendMessage(text: string) {
  // ...
}

function getUserById(id: string) {
  // ...
}

// ❌ BAD
const user_name = 'Alice' // snake_case
const UserName = 'Alice' // PascalCase
const CHANNEL_ID = 'ch_123' // SCREAMING_SNAKE_CASE (unless constant)
```

---

### Constants

**RULE**: Use SCREAMING_SNAKE_CASE for true constants

```typescript
// ✅ GOOD
const MAX_RETRIES = 3
const API_BASE_URL = 'https://api.teros.ai'
const DEFAULT_TIMEOUT = 5000

// ❌ BAD (not true constants)
const userId = 'user_123' // Variable, use camelCase
const channelName = 'Work' // Variable, use camelCase
```

**True constant**: Value never changes, defined at module level

---

### Types and Interfaces

**RULE**: Use PascalCase

```typescript
// ✅ GOOD
interface User {
  name: string
  email: string
}

type MessageRole = 'user' | 'assistant'

class TerosClient {
  // ...
}

// ❌ BAD
interface user { // lowercase
  name: string
}

type message_role = 'user' | 'assistant' // snake_case
```

---

### Acronyms in PascalCase and camelCase

**RULE**: Treat acronyms as regular words — only capitalize the first letter

```typescript
// ✅ GOOD
class LlmClientFactory {}
class McaManager {}
class HttpAuthHandler {}
interface LlmAdapter {}
type ApiResponse = { ... }

const llmAdapter = new AnthropicLlmAdapter()
const mcaService = new McaService()
const apiUrl = 'https://api.teros.ai'
function getLlmClient(): LlmClient {}

// ❌ BAD
class LLMClientFactory {} // LLM should be Llm
class MCAManager {}       // MCA should be Mca
class HTTPAuthHandler {}  // HTTP should be Http
interface LLMAdapter {}   // LLM should be Llm

const LLMAdapter = new AnthropicLLMAdapter()
const MCAService = new MCAService()
function getLLMClient(): LLMClient {}
```

**Rationale**:
- Consistent word boundaries: `LlmClient` clearly has two words, `LLMClient` is ambiguous (is it `LLMC-lient`?)
- Easier to read in compound names: `McaToolExecutor` vs `MCAToolExecutor`
- Follows the convention used by Go, C#, and many modern style guides

**Note**: This applies to all naming contexts — classes, interfaces, types, variables, functions, and filenames.

---

### Files and Directories

**RULE**: Use PascalCase for files that export a class or React component, kebab-case for everything else

```
// ✅ GOOD
src/
├── services/
│   └── SessionManager.ts       # PascalCase (exports class SessionManager)
├── conversation/
│   └── ConversationManager.ts  # PascalCase (exports class ConversationManager)
├── container/
│   └── Container.ts            # PascalCase (exports class Container)
├── utils/
│   └── format-date.ts          # kebab-case (helper functions, no class)
├── types/
│   └── database.ts             # kebab-case (type definitions, no class)
├── config.ts                   # kebab-case (configuration, no class)
├── index.ts                    # kebab-case (barrel export / entry point)
└── components/
    └── MessageBubble.tsx       # PascalCase (React component)

// ❌ BAD
src/
├── services/
│   └── session-manager.ts      # Exports a class → should be PascalCase
├── utils/
│   └── FormatDate.ts           # No class export → should be kebab-case
├── types/
│   └── Database.ts             # No class export → should be kebab-case
└── components/
    └── message-bubble.tsx      # React component → should be PascalCase
```

**How to decide**:
- Does the file export a `class`? → **PascalCase** (filename matches class name)
- Does the file export a React component? → **PascalCase** (filename matches component name)
- Everything else (utils, helpers, config, types, index files)? → **kebab-case**

**Rationale**: 
- PascalCase for classes/components: Filename matches the exported symbol, easy to find
- kebab-case for the rest: Case-insensitive filesystems, URL-friendly, consistent

---

## Function Declarations

### Function Parameters

**RULE**: 3 or fewer params on same line, 4+ params on multiple lines

```typescript
// ✅ GOOD: 3 or fewer params - same line
function createChannel(agentId: string, name: string, workspaceId?: string): Promise<Channel> {
  // Implementation
}

// ✅ GOOD: 4+ params - multiple lines
function createChannelWithMetadata(
  agentId: string,
  name: string,
  workspaceId: string,
  description: string,
): Promise<Channel> {
  // Implementation
}

// ✅ GOOD: Object destructuring for many params
function updateUser({
  userId,
  name,
  email,
}: {
  userId: string
  name?: string
  email?: string
}): Promise<User> {
  // Implementation
}

// ❌ BAD: Unclear param names
function create(a: string, b: string, c?: string) {
  // What are a, b, c?
}
```

**Guidelines**:
- Always include return type
- Use descriptive parameter names
- Consider object destructuring for 4+ parameters

---

### Arrow Functions

**RULE**: No braces for simple expressions, braces for statements

```typescript
// ✅ GOOD: Simple expression without braces
const doubled = numbers.map((n) => n * 2)
const active = users.filter((u) => u.status === "active")

// ✅ GOOD: Multiple statements with braces
const processed = users.map((u) => {
  const name = u.name.toUpperCase()
  return { ...u, name }
})

// ❌ BAD: Unnecessary braces for simple expression
const doubled = numbers.map((n) => {
  return n * 2
})
```

**Rationale**: Concise for simple cases, clear for complex logic

---

### Arrow Functions vs Function Declarations

**RULE**: Use arrow functions for callbacks, function declarations for top-level functions

```typescript
// ✅ GOOD: Function declaration for top-level
function processMessage(message: Message) {
  return message.content.toUpperCase()
}

// ✅ GOOD: Arrow function for callback
const messages = await getMessages()
const processed = messages.map((msg) => msg.content.toUpperCase())

// ❌ BAD: Arrow function for top-level (harder to spot in stack traces)
const processMessage = (message: Message) => {
  return message.content.toUpperCase()
}
```

**Exception**: Arrow functions in React components

```typescript
// ✅ GOOD: React component as arrow function
export const MessageBubble = ({ message }: Props) => {
  return <View>{message.content}</View>
}
```

---

### Arrow Function Parentheses

**RULE**: Always use parentheses around arrow function parameters

```typescript
// ✅ GOOD
const double = (x: number) => x * 2
const greet = (name: string) => `Hello, ${name}`

// ❌ BAD (missing parens)
const double = x => x * 2
const greet = name => `Hello, ${name}`
```

**Rationale**: Consistency, easier to add type annotations

---

### Conditionals and Early Returns

**RULE**: No braces for early returns, braces for everything else

```typescript
// ✅ GOOD: Early returns without braces
function isActive(user: User): boolean {
  if (!user) return false
  if (user.status === "deleted") return false
  
  // Complex logic with braces
  if (user.lastLogin) {
    const daysSinceLogin = getDaysSince(user.lastLogin)
    return daysSinceLogin < 30
  }
  
  return user.status === "active"
}

// ❌ BAD: Braces on early returns
function isActive(user: User): boolean {
  if (!user) {
    return false
  }
  if (user.status === "deleted") {
    return false
  }
  return user.status === "active"
}
```

**Rationale**: Early returns are clear and concise without braces

---

### Function Length

**RULE**: Functions should be max 50 lines

```typescript
// ✅ GOOD: Short, focused function (5 lines)
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// ✅ ACCEPTABLE: Moderate function (20-30 lines)
function processUser(user: User): ProcessedUser {
  // Validation (5 lines)
  // Transformation (10 lines)
  // Return (5 lines)
  // Total: ~20 lines
}

// ❌ BAD: Function doing too much (>50 lines)
function processUserDataAndSendEmailAndLogAndUpdateDatabase(user: User) {
  // 80 lines of code...
  // Should be split into smaller functions
}
```

**Guidelines**:
- **Ideal**: 20-30 lines for most functions
- **Maximum**: 50 lines
- **Exception**: Configuration/setup functions can reach 75 lines if necessary

**When a function is too long**:
1. Extract helper functions
2. Use early returns to reduce nesting
3. Consider if it's doing too much (SRP violation)

---

### File Length

**RULE**: Files should be max 300 lines

```typescript
// ✅ GOOD: Focused module (150-200 lines)
// user-service.ts (180 lines)
// - Imports (10 lines)
// - Types (20 lines)
// - Service class (150 lines with 5-6 methods)

// ❌ BAD: God file (>300 lines)
// user-everything.ts (500 lines)
// - Should be split into multiple files
```

**Guidelines**:
- **Ideal**: 150-200 lines for most files
- **Maximum**: 300 lines
- **Exceptions allowed for**:
  - Complex type definitions
  - Extensive configuration files
  - Comprehensive test suites

**When a file is too long**:
1. Split by responsibility (SRP)
2. Extract utilities to separate files
3. Move types to dedicated type files

---

## TypeScript Conventions

### Type Annotations

**RULE**: Always annotate function return types

```typescript
// ✅ GOOD
function getUser(id: string): Promise<User> {
  return db.users.findOne({ id })
}

function isActive(user: User): boolean {
  return user.status === 'active'
}

// ❌ BAD (missing return type)
function getUser(id: string) {
  return db.users.findOne({ id })
}
```

**Exception**: Simple arrow functions where type is obvious

```typescript
// ✅ OK: Type is obvious from context
const numbers = [1, 2, 3].map((n) => n * 2)
```

---

### Type vs Interface

**RULE**: Use `interface` for object shapes, `type` for unions/intersections

```typescript
// ✅ GOOD: Interface for object
interface User {
  name: string
  email: string
}

// ✅ GOOD: Type for union
type MessageRole = 'user' | 'assistant' | 'system'

// ✅ GOOD: Type for intersection
type AuthenticatedUser = User & { sessionToken: string }

// ❌ BAD: Type for simple object (use interface)
type User = {
  name: string
  email: string
}
```

**Rationale**: Interfaces are extensible, types are more flexible for complex types

---

### Any and Unknown

**RULE**: Avoid `any`, prefer `unknown`

```typescript
// ✅ GOOD: Use unknown for truly unknown types
function parseJSON(json: string): unknown {
  return JSON.parse(json)
}

// ✅ GOOD: Type guard to narrow unknown
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'email' in value
  )
}

// ❌ BAD: Using any (disables type checking)
function parseJSON(json: string): any {
  return JSON.parse(json)
}
```

**Exception**: `any` is allowed when interfacing with untyped libraries (but document why)

---

### Optional vs Undefined

**RULE**: Use optional (`?`) for optional properties, explicit `| undefined` when it matters

```typescript
// ✅ GOOD: Optional property
interface User {
  name: string
  email?: string // May not be present
}

// ✅ GOOD: Explicit undefined when semantically different
interface UpdateUserParams {
  name: string | undefined // Explicitly setting to undefined clears the value
  email?: string // Optional, won't be included in update if not provided
}

// ❌ BAD: Mixing optional and undefined unnecessarily
interface User {
  email?: string | undefined // Redundant
}
```

---

## Import/Export Conventions

### Import Order

**RULE**: Group imports in this order:

1. External libraries
2. Internal packages (`@teros/*`)
3. Relative imports (same package)
4. Type imports (last)

```typescript
// ✅ GOOD
// 1. External libraries
import React from 'react'
import { View, Text } from 'react-native'

// 2. Internal packages
import { User, Message } from '@teros/shared'
import { TerosClient } from '@teros/core'

// 3. Relative imports
import { formatDate } from '../utils/date'
import { MessageBubble } from './MessageBubble'

// 4. Type imports
import type { Channel } from '@teros/shared'

// ❌ BAD (mixed order)
import { MessageBubble } from './MessageBubble'
import React from 'react'
import type { Channel } from '@teros/shared'
import { formatDate } from '../utils/date'
```

**Biome auto-organizes imports**, so this is mostly automatic.

---

### Named vs Default Exports

**RULE**: Prefer named exports

```typescript
// ✅ GOOD: Named export
export function createChannel(agentId: string) {
  // ...
}

export const MAX_RETRIES = 3

// ✅ GOOD: Multiple named exports
export { createChannel, updateChannel, deleteChannel }

// ❌ BAD: Default export (harder to refactor, rename)
export default function createChannel(agentId: string) {
  // ...
}
```

**Exception**: React components can use default export (but named is preferred)

```typescript
// ✅ ACCEPTABLE
export default function MessageBubble({ message }: Props) {
  // ...
}

// ✅ BETTER
export function MessageBubble({ message }: Props) {
  // ...
}
```

---

### Barrel Exports

**RULE**: Use index files to re-export from directories

```typescript
// src/services/index.ts
export { TerosClient } from './TerosClient'
export { storage } from './storage'
export { windowRegistry } from './windowRegistry'

// Usage
import { TerosClient, storage } from '@/services'
```

**Don't**: Export everything with `export *` (makes it hard to track what's exported)

---

## Code Organization

### File Structure

**RULE**: Organize code in this order:

1. Imports
2. Type definitions
3. Constants
4. Helper functions
5. Main function/component
6. Exports

```typescript
// 1. Imports
import React from 'react'
import { View } from 'react-native'

// 2. Type definitions
interface Props {
  message: Message
  onPress: () => void
}

// 3. Constants
const MAX_LENGTH = 100

// 4. Helper functions
function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + '...' : text
}

// 5. Main component
export function MessageBubble({ message, onPress }: Props) {
  const displayText = truncate(message.content, MAX_LENGTH)
  
  return (
    <View onPress={onPress}>
      <Text>{displayText}</Text>
    </View>
  )
}

// 6. Exports (if not inline)
```

---

### One Component Per File

**RULE**: One main export per file

```typescript
// ✅ GOOD: MessageBubble.tsx
export function MessageBubble({ message }: Props) {
  return <View>{message.content}</View>
}

// ❌ BAD: Multiple unrelated components in one file
export function MessageBubble({ message }: Props) {
  return <View>{message.content}</View>
}

export function UserAvatar({ user }: Props) {
  return <Image source={user.avatar} />
}

export function ChannelList({ channels }: Props) {
  return <FlatList data={channels} />
}
```

**Exception**: Small, tightly coupled helper components

```typescript
// ✅ OK: Helper component only used by MessageBubble
function MessageTimestamp({ timestamp }: { timestamp: Date }) {
  return <Text>{formatDate(timestamp)}</Text>
}

export function MessageBubble({ message }: Props) {
  return (
    <View>
      <Text>{message.content}</Text>
      <MessageTimestamp timestamp={message.timestamp} />
    </View>
  )
}
```

---

## Comments

### When to Comment

**RULE**: Comment the "why", not the "what"

```typescript
// ✅ GOOD: Explains why
// We need to delay reconnection to avoid overwhelming the server
// after a network outage affecting many users simultaneously
await sleep(reconnectDelay)

// ❌ BAD: States the obvious
// Set the name variable to 'Alice'
const name = 'Alice'

// ❌ BAD: Comment instead of clear code
// Check if user is admin
if (user.role === 'admin') {
  // ...
}

// ✅ BETTER: Clear code, no comment needed
if (isAdmin(user)) {
  // ...
}
```

---

### JSDoc Comments

**RULE**: Use JSDoc for public APIs and complex functions

```typescript
/**
 * Send a message to a channel
 * 
 * @param channelId - The channel to send to
 * @param text - Message text content
 * @param options - Additional message options
 * @returns Promise resolving to the sent message
 * 
 * @example
 * const message = await sendMessage('ch_123', 'Hello!', {
 *   mentions: ['user_456']
 * })
 */
export async function sendMessage(
  channelId: string,
  text: string,
  options?: MessageOptions,
): Promise<Message> {
  // Implementation
}
```

**Required for**:
- Public API functions
- MCA tool definitions (auto-generates tools.json)
- Complex algorithms

---

### TODO Comments

**RULE**: Use TODO with ticket reference

```typescript
// ✅ GOOD
// TODO(#123): Implement retry logic for failed uploads

// ❌ BAD
// TODO: fix this later
// FIXME: broken
```

---

## Error Handling

### Try-Catch

**RULE**: Catch specific errors, don't swallow them

```typescript
// ✅ GOOD: Specific error handling
try {
  const user = await getUser(userId)
  return user
} catch (error) {
  if (error instanceof NotFoundError) {
    return null
  }
  // Re-throw unexpected errors
  throw error
}

// ❌ BAD: Swallowing all errors
try {
  const user = await getUser(userId)
  return user
} catch (error) {
  return null // What if it was a network error?
}
```

---

### Error Types

**RULE**: Type error in catch blocks

```typescript
// ✅ GOOD: Type the error
try {
  await doSomething()
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  } else {
    console.error('Unknown error', error)
  }
}

// ❌ BAD: Assuming error is Error
try {
  await doSomething()
} catch (error) {
  console.error(error.message) // error is unknown, might not have .message
}
```

---

## React/React Native Patterns

### Component Props

**RULE**: Define props interface above component, destructure in function body

```typescript
// ✅ GOOD: Interface above, destructure in body
interface MessageBubbleProps {
  message: Message
  isUser: boolean
  onPress?: () => void
}

export function MessageBubble(props: MessageBubbleProps) {
  const { message, isUser, onPress } = props
  // ...
}

// ❌ BAD: Destructure in parameters
export function MessageBubble({ message, isUser, onPress }: MessageBubbleProps) {
  // ...
}
```

**Rationale**: Clearer when you need to reference `props` object, easier to add/remove props

---

### Hooks Order

**RULE**: Hooks in this order:

1. State hooks (useState, useReducer)
2. Context hooks (useContext, custom hooks using context)
3. Ref hooks (useRef)
4. Effect hooks (useEffect, useLayoutEffect)
5. Custom hooks

```typescript
export function ChatScreen() {
  // 1. State
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  
  // 2. Context/Store
  const client = useTerosClient()
  const messages = useChatStore((state) => state.messages)
  
  // 3. Refs
  const inputRef = useRef<TextInput>(null)
  
  // 4. Effects
  useEffect(() => {
    loadMessages()
  }, [])
  
  // 5. Custom hooks
  const { sendMessage } = useChannel(channelId)
  
  // ...
}
```

---

### Event Handlers

**RULE**: Prefix event handlers with `handle`

```typescript
// ✅ GOOD
function ChatScreen() {
  const handleSend = (text: string) => {
    sendMessage(text)
  }
  
  const handlePress = () => {
    console.log('Pressed')
  }
  
  return <InputComposer onSend={handleSend} />
}

// ❌ BAD
function ChatScreen() {
  const send = (text: string) => { // Not clear it's a handler
    sendMessage(text)
  }
  
  return <InputComposer onSend={send} />
}
```

---

## Async/Await

### Always Use Async/Await

**RULE**: Prefer async/await over .then()

```typescript
// ✅ GOOD
async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const user = await response.json()
  return user
}

// ❌ BAD (promise chains)
function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(user => user)
}
```

**Exception**: When you need Promise.all or Promise.race

```typescript
// ✅ GOOD
const [user, channels] = await Promise.all([
  getUser(userId),
  getChannels(userId),
])
```

---

### Await in Loops

**RULE**: Be intentional about sequential vs parallel

```typescript
// ✅ GOOD: Sequential (when order matters)
for (const userId of userIds) {
  await sendEmail(userId) // Wait for each
}

// ✅ GOOD: Parallel (when independent)
await Promise.all(
  userIds.map((userId) => sendEmail(userId))
)

// ❌ BAD: Accidentally sequential (slow)
const emails = []
for (const userId of userIds) {
  emails.push(await sendEmail(userId)) // Use Promise.all instead
}
```

---

## Separation of Responsibilities

### Single Responsibility Principle

**RULE**: Each file/module should have ONE clear responsibility

```typescript
// ✅ GOOD: Focused modules
// user-service.ts       - User business logic
// user-repository.ts    - User data access
// user-validator.ts     - User validation
// user-types.ts         - User type definitions

// ❌ BAD: God file
// user.ts - Everything about users (500 lines)
```

### MCA Structure

**RULE**: One tool per file in MCAs

```
mcas/mca.teros.todo/
├── manifest.json
├── tools.json              # Auto-generated, never edit manually
├── src/
│   ├── index.ts            # ONLY exports and configuration
│   └── tools/
│       ├── todo-create.ts  # One tool = one file
│       ├── todo-update.ts
│       ├── todo-delete.ts
│       └── todo-list.ts
```

**`index.ts` should ONLY**:
- Import tools
- Export tools array
- Configure tool metadata
- **NO business logic**

```typescript
// ✅ GOOD: index.ts
import { todoCreate } from './tools/todo-create'
import { todoUpdate } from './tools/todo-update'
import { todoDelete } from './tools/todo-delete'

export const tools = [todoCreate, todoUpdate, todoDelete]

// ❌ BAD: index.ts with logic
export const tools = [
  {
    name: 'todo-create',
    execute: async (params) => {
      // 50 lines of logic here...
    }
  }
]
```

### Backend Service Organization

**RULE**: Separate concerns into layers

```
packages/backend/src/
├── handlers/          # Request/WebSocket handlers
│   └── websocket-handler.ts
├── services/          # Business logic
│   └── user-service.ts
├── models/            # Data models
│   └── user-model.ts
└── types/             # Type definitions
    └── user-types.ts
```

**Responsibilities**:
- **Handlers**: Receive requests, call services, send responses
- **Services**: Business logic, orchestration
- **Models**: Data access, MongoDB operations
- **Types**: Type definitions, interfaces

---

## Dependency Injection

### Container Usage

**RULE**: Use ONLY the existing DI container (`packages/backend/src/container/`)

**DO NOT**:
- Install external DI libraries (inversify, tsyringe, awilix)
- Create multiple DI systems
- Instantiate services directly with `new`

### Service Registration

**RULE**: ALL services/managers MUST be registered in `bootstrap.ts`

```typescript
// ✅ GOOD: Register in bootstrap.ts
// packages/backend/src/container/bootstrap.ts
container.register(Tokens.UserService, (c) => 
  new UserService(c.get(Tokens.Db))
)

// ❌ BAD: Direct instantiation
const userService = new UserService(db)
```

### Service Consumption

**RULE**: Get services from container, never instantiate directly

```typescript
// ✅ GOOD: Get from container
const userService = container.get(Tokens.UserService)

// ✅ GOOD: Constructor injection in handlers
class UserHandler {
  constructor(
    private userService: UserService,
    private sessionManager: SessionManager
  ) {}
}

// ❌ BAD: Direct instantiation
const userService = new UserService(db, config)
```

### Pattern Summary

**Single pattern to follow**:
1. **Define token** in `tokens.ts`
2. **Register factory** in `bootstrap.ts`
3. **Inject via constructor** or get from container
4. **NEVER `new Service()`** outside `bootstrap.ts`

```typescript
// 1. Define token (tokens.ts)
export const Tokens = {
  UserService: createToken<UserService>('UserService')
}

// 2. Register (bootstrap.ts)
container.register(Tokens.UserService, (c) => 
  new UserService(c.get(Tokens.Db))
)

// 3. Use (anywhere)
const userService = container.get(Tokens.UserService)
```

---

## Testing Conventions (Future)

### Test File Naming

```
src/
├── services/
│   ├── TerosClient.ts
│   └── TerosClient.test.ts    # Co-located test
```

### Test Structure

```typescript
describe('TerosClient', () => {
  describe('connect', () => {
    it('should connect to WebSocket server', async () => {
      // Arrange
      const client = new TerosClient()
      
      // Act
      await client.connect('ws://localhost:3001')
      
      // Assert
      expect(client.isConnected()).toBe(true)
    })
  })
})
```

---

## Biome Configuration

Update `biome.json` to match these guidelines:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "includes": [
      "**",
      "!**/node_modules",
      "!**/dist",
      "!**/build",
      "!**/.expo",
      "!**/.next",
      "!**/coverage",
      "!**/*.min.js"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noExcessiveCognitiveComplexity": {
          "level": "warn",
          "options": {
            "maxAllowedComplexity": 15
          }
        },
        "noExcessiveLinesPerFunction": {
          "level": "warn",
          "options": {
            "maxLines": 100
          }
        }
      },
      "style": {
        "useConst": "warn",
        "useTemplate": "warn",
        "noParameterAssign": "warn"
      },
      "suspicious": {
        "noExplicitAny": "off",
        "noArrayIndexKey": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "asNeeded",
      "arrowParentheses": "always"
    }
  }
}
```

**Key changes from current config**:
- `semicolons: "asNeeded"` (was "always") - No semicolons unless necessary
- Everything else stays the same

---

## Migration from Current Code

### Gradual Migration

**RULE**: Don't reformat the entire codebase at once

**Process**:
1. Update `biome.json` with new settings
2. Format new files with new rules
3. Reformat existing files as you touch them
4. Eventually, run `yarn lint:fix` on entire codebase

### Before Committing

```bash
# Format your changes
yarn lint:fix

# Check for issues
yarn lint
```

---

## Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Backend architecture
- [APP-ARCHITECTURE.md](./APP-ARCHITECTURE.md) - Frontend architecture
- [SPEC-DRIVEN-WORKFLOW.md](./SPEC-DRIVEN-WORKFLOW.md) - Development workflow

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.3.0 | 2026-02-24 | Added: No Code Duplication (DRY) as Core Principle 4 | Alice Evergreen |
| 1.2.0 | 2026-02-04 | Added: Language policy (English only for code, comments, docs, commits) | Alice Evergreen |
| 1.1.0 | 2026-02-04 | Added: Function length (50 lines), File length (300 lines), Separation of Responsibilities, DI patterns, MCA structure rules | Alice Evergreen |
| 1.0.0 | 2026-02-04 | Initial version | Alice Evergreen |

---

**Consistency is key. Follow these guidelines and let Biome handle the rest!** 🎨
