# Acceptance Testing Guidelines

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Created** | 2026-05-16 |
| **Updated** | 2026-05-16 |
| **Author** | Pablo López Torres / Alice Evergreen |

## Overview

This document defines how to write acceptance tests using Gherkin syntax. Acceptance tests validate that the system meets the requirements defined in specifications.

### Why Gherkin?

- **Human-Readable**: Non-technical stakeholders can understand tests
- **Specification by Example**: Tests are executable specifications
- **Behavior-Driven**: Focuses on what the system does, not how
- **Language-Agnostic**: Same format works with any test framework
- **Living Documentation**: Tests document actual system behavior

---

## BDD vs TDD — The Critical Distinction

This is the most important rule in this document.

**BDD scenarios describe observable behavior in business language. They never describe implementation.**

### The three levels

| Level | Subject | Language | Where it lives |
|-------|---------|----------|----------------|
| **User-facing BDD** | The human user | Business language | `.feature` file |
| **System-facing BDD** | The system or agent | Observable behavior | `.feature` file |
| **Unit test (TDD)** | Internal code | Technical | `*.test.ts` file |

### User-facing BDD

The subject is a human user. The language is what a non-technical stakeholder would say. These scenarios are often written first in the UX phase (`ux.md`) and reused in the `.feature` file.

```gherkin
# ✅ User-facing BDD
Scenario: Start a conversation with an agent
  Given I am logged in to Teros
  When I start a new conversation with Nira
  Then the conversation should appear in my sidebar
  And I should be able to send messages

Scenario: Name a conversation
  Given I have a conversation with Nira
  When I rename it to "BDD Sprint"
  Then the new name should appear in my sidebar
```

### System-facing BDD

The subject is the system, a service, or an agent. The language describes observable behavior — what the system does, not how it does it internally.

```gherkin
# ✅ System-facing BDD
Scenario: Agent calls a tool successfully
  Given agent "Nira" has access to the filesystem MCA
  And a channel exists in workspace "work_teros"
  When the agent calls the "read" tool with path "/workspace/README.md"
  Then the tool should return the file contents

Scenario: MCA reports not ready when API key is missing
  Given the Perplexity MCA is running
  And the API key is not configured
  When the health check is called
  Then the status should be "not_ready"
  And the issue code should be "SYSTEM_CONFIG_MISSING"
```

### ❌ Not BDD — move to unit tests

If a scenario mentions function names, class names, database collections, WebSocket message types, or any other implementation detail, it is a unit test disguised as a BDD scenario.

```gherkin
# ❌ NOT BDD — this is a unit test
Scenario: Create channel
  When ChannelManager.create() is called with agentId "agent_nira"
  Then the MongoDB "channels" collection should have one more document
  And the document should have a workspaceId field

# ❌ NOT BDD — WebSocket message type is an implementation detail
Scenario: Create channel via WebSocket
  When I send a message with type "create_channel" and agentId "agent_nira"
  Then I should receive a "channel_created" message
```

The correct BDD version of the above:

```gherkin
# ✅ User-facing BDD
Scenario: Start a conversation with an agent
  When I start a new conversation with Nira
  Then the conversation should appear in my sidebar
```

### The test for "is this BDD?"

Read the scenario aloud to a product manager or designer. If they understand it without any explanation, it is BDD. If they ask "what is a `channel_created` message?", it is not.

---

---

## Test Writer Role

The Test Writer is responsible for:

1. **Reading specifications** from `/docs/specs/{namespace}/`
2. **Reading the UX spec** (`ux.md`) if the feature has UI — it may already contain user-facing Gherkin scenarios
3. **Reusing** user-facing scenarios from `ux.md` when they cover an AC — do not duplicate them
4. **Writing additional** system-level scenarios for ACs not covered by the UX spec
5. **Ensuring complete coverage** of all acceptance criteria
6. **Maintaining test quality** (clarity, independence, determinism)
7. **Updating tests** when specs change

**Key Principle**: Every acceptance criterion in a spec MUST have at least one test scenario. Prefer reusing scenarios from `ux.md` over writing new ones when they already express the intent correctly.

---

## File Organization

### Test Location

Tests mirror the spec directory structure:

```
tests/acceptance/
├── core/
│   ├── authentication.feature
│   ├── session-management.feature
│   └── user-management.feature
├── agents/
│   ├── agent-cores.feature
│   └── agent-instances.feature
├── channels/
│   ├── channel-management.feature
│   └── channel-naming.feature
├── messaging/
│   ├── websocket-api.feature
│   └── streaming-responses.feature
└── mca/
    ├── mca-protocol.feature
    └── tool-execution.feature
```

### Naming Convention

**Format**: `{spec-name}.feature`

**Mapping**:
- Spec: `/docs/specs/core/authentication.md`
- Test: `/tests/acceptance/core/authentication.feature`

**Rules**:
- Use `.feature` extension
- Match spec filename exactly (except extension)
- One test file per spec file

---

## Gherkin Format

### Basic Structure

```gherkin
# Comment: Brief description of what this feature tests

Feature: [Feature Name]
  As a [user type]
  I want to [action]
  So that [benefit]

  Background:
    Given [common setup for all scenarios]
    And [additional setup]

  Scenario: [Description of test case]
    Given [initial state]
    When [action occurs]
    Then [expected outcome]
    And [additional verification]

  Scenario: [Another test case]
    Given [initial state]
    When [action]
    Then [outcome]
```

### Keywords

- **Feature**: High-level description of functionality being tested
- **Scenario**: Individual test case
- **Background**: Setup that runs before each scenario
- **Given**: Initial state / preconditions
- **When**: Action being tested
- **Then**: Expected outcome / assertions
- **And**: Additional steps of the same type
- **But**: Negative assertion (less common)

---

## Writing Feature Descriptions

### Feature Block

**Format**:
```gherkin
Feature: [Feature Name]
  As a [user type]
  I want to [action]
  So that [benefit]
```

**Example (Good)**:
```gherkin
Feature: User Authentication
  As a client application
  I want to authenticate users via WebSocket
  So that I can establish secure sessions
```

**Example (Bad)**:
```gherkin
Feature: Auth
  Testing authentication stuff
```

**Guidelines**:
- Use the same name as the spec
- Include user story format (As a... I want... So that...)
- Be specific about who benefits and why

---

## Writing Scenarios

### Scenario Naming

**Format**: `Scenario: [Action/Outcome Description]`

**Good Examples**:
```gherkin
Scenario: Authenticate with valid credentials
Scenario: Reject invalid password
Scenario: Create channel with custom name
Scenario: Stream LLM response in chunks
```

**Bad Examples**:
```gherkin
Scenario: Test 1
Scenario: Auth works
Scenario: Happy path
```

**Guidelines**:
- Be descriptive and specific
- Start with action verb when possible
- Describe the outcome, not the implementation
- Keep it concise (under 10 words)

---

### Background Section

**Purpose**: Setup that applies to ALL scenarios in the feature

**When to Use**:
- Authentication state
- Database setup
- Service initialization
- Common preconditions

**Example**:
```gherkin
Background:
  Given the TerOS backend is running
  And I am authenticated as "pablo@teros.ai"
  And I have a WebSocket connection
```

**When NOT to Use**:
- Scenario-specific setup (use Given instead)
- Data that varies between scenarios
- Actions being tested

---

### Given Steps (Preconditions)

**Purpose**: Set up the initial state before the action

**Format**: Past tense or present perfect

**Examples**:
```gherkin
Given I am authenticated as "pablo@teros.ai"
Given the user has 3 active channels
Given a channel exists with id "ch_abc123"
Given the MCA "gmail" is installed
Given I have a valid session token
```

**Guidelines**:
- Use past tense (state already exists)
- Be specific about data
- Use concrete values when relevant
- Don't include actions being tested

---

### When Steps (Actions)

**Purpose**: The action being tested

**Format**: Present tense

**Examples**:
```gherkin
When I send a message with type "create_channel"
When I authenticate with email "user@example.com"
When the agent responds with a tool call
When I close the WebSocket connection
When I wait for 5 seconds
```

**Guidelines**:
- Use present tense (action happening now)
- One action per When step (usually)
- Be explicit about what's happening
- Include relevant parameters

---

### Then Steps (Assertions)

**Purpose**: Verify the expected outcome

**Format**: Present tense or modal (should)

**Examples**:
```gherkin
Then I should receive an "auth_success" message
Then the channel should be created
Then the response should contain a userId
Then the WebSocket connection should remain open
Then the error message should be "Invalid credentials"
```

**Guidelines**:
- Use "should" for expectations
- Be specific about what to verify
- Include expected values when relevant
- Can have multiple Then/And steps

---

## Data Tables

### Inline Data

Use tables to specify structured data:

```gherkin
When I send a message:
  | type    | create_channel |
  | agentId | agent:iria     |
  | name    | Work Project   |
Then I should receive a "channel_created" message
And the message should contain:
  | channelId | not empty  |
  | agentId   | agent:iria |
  | name      | Work Project |
```

**Guidelines**:
- Use for message payloads
- Use for expected response fields
- Keep tables concise (< 10 rows)
- Align columns for readability

---

### Examples (Scenario Outlines)

Use for testing multiple similar cases:

```gherkin
Scenario Outline: Authenticate with different credentials
  When I send an auth message with:
    | email    | <email>    |
    | password | <password> |
  Then I should receive a "<result>" message

  Examples:
    | email              | password    | result       |
    | pablo@teros.ai     | stellar1985 | auth_success |
    | invalid@email.com  | wrongpass   | auth_error   |
    | missing@email.com  | anypass     | auth_error   |
```

**When to Use**:
- Testing multiple input variations
- Boundary testing
- Error case coverage

**When NOT to Use**:
- Scenarios are conceptually different
- Setup varies significantly
- Makes test harder to understand

---

## Coverage Guidelines

### Mapping Acceptance Criteria to Tests

**For each acceptance criterion in the spec, write at least one scenario.**

**Example Spec**:
```markdown
## Acceptance Criteria

- **AC-1**: User can authenticate with email/password
- **AC-2**: Invalid credentials are rejected
- **AC-3**: User can reconnect with session token
- **AC-4**: Expired tokens are rejected
```

**Corresponding Tests**:
```gherkin
Scenario: Authenticate with valid credentials  # Covers AC-1
Scenario: Reject invalid password              # Covers AC-2
Scenario: Authenticate with session token      # Covers AC-3
Scenario: Reject expired session token         # Covers AC-4
```

---

### Test Coverage Checklist

For each spec, ensure tests cover:

- [ ] **Happy Path**: Normal, successful flow
- [ ] **Error Cases**: All error conditions from spec
- [ ] **Edge Cases**: Boundary conditions, empty values, nulls
- [ ] **Validation**: Input validation rules
- [ ] **State Transitions**: Status changes, lifecycle
- [ ] **Concurrency**: If relevant (multiple operations)
- [ ] **Performance**: If NFRs specify timing

---

## Test Quality Standards

### Independence

**Each scenario should be independent and not rely on other scenarios.**

**Bad** (Dependent):
```gherkin
Scenario: Create a channel
  When I create a channel
  Then the channel should exist

Scenario: Send message to channel
  # Assumes channel from previous scenario exists
  When I send a message to the channel
  Then the message should be delivered
```

**Good** (Independent):
```gherkin
Scenario: Create a channel
  When I create a channel
  Then the channel should exist

Scenario: Send message to channel
  Given I have created a channel  # Own setup
  When I send a message to the channel
  Then the message should be delivered
```

---

### Determinism

**Tests should always produce the same result.**

**Bad** (Non-Deterministic):
```gherkin
When I wait for a random amount of time
Then the response might arrive
```

**Good** (Deterministic):
```gherkin
When I wait for 5 seconds
Then the response should arrive within the timeout
```

**Common Issues**:
- Relying on timing without explicit waits
- Using random data without controlling it
- Depending on external services
- Not cleaning up state

---

### Clarity

**Tests should be easy to understand.**

**Bad** (Unclear):
```gherkin
Scenario: Test auth
  Given stuff is set up
  When I do the thing
  Then it works
```

**Good** (Clear):
```gherkin
Scenario: Authenticate with valid credentials
  Given the backend is running
  When I send an auth message with email "user@example.com" and password "secret"
  Then I should receive an auth success response with a session token
```

**Guidelines**:
- Use concrete values
- Be explicit about actions
- Avoid vague terms ("stuff", "thing", "it")
- Include relevant context

---

### Conciseness

**Don't over-specify implementation details.**

**Bad** (Too Detailed):
```gherkin
Scenario: Create channel
  Given the database is connected
  And the MongoDB collection "channels" exists
  And the bcrypt library is loaded
  When I send a create_channel message
  And the backend receives it on the WebSocket handler
  And it validates the agentId against the database
  And it generates a new channelId with prefix "ch_"
  And it inserts a document into MongoDB
  Then a channel_created message is sent back
```

**Good** (Right Level):
```gherkin
Scenario: Create channel
  Given I am authenticated
  When I send a create_channel message with agentId "agent:iria"
  Then I should receive a channel_created message
  And the channel should have a valid channelId
```

---

## Common Patterns

### Authentication

```gherkin
Background:
  Given the TerOS backend is running
  And I am authenticated as "pablo@teros.ai"
```

Or for testing auth itself:

```gherkin
Scenario: Authenticate with valid credentials
  Given the backend is running
  And a WebSocket connection is established
  When I send an auth message with:
    | email    | pablo@teros.ai |
    | password | stellar1985    |
  Then I should receive an "auth_success" message
```

---

### Message Exchange

```gherkin
When I send a message:
  | type    | create_channel |
  | agentId | agent:iria     |
Then I should receive a "channel_created" message
And the message should contain:
  | channelId | not empty  |
  | agentId   | agent:iria |
```

---

### Error Handling

```gherkin
Scenario: Reject invalid input
  When I send a message with invalid data:
    | type    | create_channel |
    | agentId | invalid_id     |
  Then I should receive an "error" message
  And the error code should be "INVALID_AGENT"
  And the error message should contain "Agent not found"
```

---

### State Verification

```gherkin
Scenario: Channel persists after creation
  Given I have created a channel with id "ch_abc123"
  When I disconnect and reconnect
  And I list my channels
  Then the channel "ch_abc123" should still exist
  And it should have the same properties
```

---

### Async Operations

```gherkin
Scenario: Receive streaming response
  When I send a message to the agent
  Then I should receive a "message_start" event
  And I should receive multiple "message_chunk" events
  And I should receive a "message_complete" event
  And the chunks should combine to form a complete message
```

---

## Anti-Patterns

### ❌ Anti-Pattern 1: Testing Implementation

**Bad**:
```gherkin
Scenario: Create channel
  When the ChannelManager.createChannel() method is called
  And it inserts into MongoDB collection "channels"
  Then the database should have one more document
```

**Good**:
```gherkin
Scenario: Create channel
  When I create a channel with agent "agent:iria"
  Then the channel should exist
  And I should be able to send messages to it
```

---

### ❌ Anti-Pattern 2: Multiple Actions in When

**Bad**:
```gherkin
When I create a channel and send a message and close it
Then something happens
```

**Good**:
```gherkin
Given I have created a channel
And I have sent a message to it
When I close the channel
Then the channel status should be "closed"
```

---

### ❌ Anti-Pattern 3: Vague Assertions

**Bad**:
```gherkin
Then the response should be correct
Then it should work
Then the data should be valid
```

**Good**:
```gherkin
Then the response should contain a channelId
Then the channel status should be "active"
Then the message should have a timestamp
```

---

### ❌ Anti-Pattern 4: UI-Specific Steps

**Bad**:
```gherkin
When I click the "Create Channel" button
And I type "Work Project" in the name field
Then I should see a success message
```

**Good** (for acceptance tests):
```gherkin
When I create a channel with name "Work Project"
Then the channel should be created successfully
```

*Note: UI-specific tests belong in UI/E2E tests, not acceptance tests*

---

## Example: Complete Feature File

**File**: `/tests/acceptance/channels/channel-naming.feature`

```gherkin
# Feature: Channel Naming
# Allow users to assign custom names to channels

Feature: Channel Naming
  As a user
  I want to name my channels
  So that I can easily identify them

  Background:
    Given the TerOS backend is running
    And I am authenticated as "pablo@teros.ai"

  # AC-1: Create with Name
  Scenario: Create channel with custom name
    When I send a message:
      | type    | create_channel |
      | agentId | agent:iria     |
      | name    | Work Project   |
    Then I should receive a "channel_created" message
    And the message should contain:
      | channelId | not empty    |
      | name      | Work Project |

  # AC-2: Rename Channel
  Scenario: Rename existing channel
    Given I have created a channel with name "Old Name"
    When I send a message:
      | type      | rename_channel |
      | channelId | <channelId>    |
      | name      | New Name       |
    Then I should receive a "channel_renamed" message
    And the channel name should be "New Name"

  # AC-2: Name persists
  Scenario: Channel name persists after reconnection
    Given I have created a channel with name "My Project"
    When I disconnect and reconnect
    And I list my channels
    Then the channel should still have name "My Project"

  # AC-3: Default Naming
  Scenario: Channel without name defaults to agent name
    When I send a message:
      | type    | create_channel |
      | agentId | agent:iria     |
    Then I should receive a "channel_created" message
    And the channel name should be "Iria"

  # AC-4: Validation - Empty Name
  Scenario: Reject empty channel name
    When I send a message:
      | type    | create_channel |
      | agentId | agent:iria     |
      | name    |                |
    Then I should receive an "error" message
    And the error code should be "INVALID_NAME"
    And the error message should contain "Name cannot be empty"

  # AC-4: Validation - Long Name
  Scenario: Reject channel name exceeding 100 characters
    When I send a message:
      | type    | create_channel |
      | agentId | agent:iria     |
      | name    | <101 char string> |
    Then I should receive an "error" message
    And the error code should be "INVALID_NAME"
    And the error message should contain "Name too long"

  # AC-4: Validation - Unicode Support
  Scenario: Accept Unicode characters in channel name
    When I send a message:
      | type    | create_channel |
      | agentId | agent:iria     |
      | name    | 工作项目 🚀    |
    Then I should receive a "channel_created" message
    And the channel name should be "工作项目 🚀"
```

---

## Test Execution

### Running Tests

Tests should be executable with a test framework (Cucumber.js, Vitest with Gherkin plugin, etc.)

```bash
# Run all tests
npm test

# Run specific namespace
npm test tests/acceptance/channels/

# Run specific feature
npm test tests/acceptance/channels/channel-naming.feature

# Run with tags
npm test --grep @smoke
```

---

### Test Tags

Use tags to organize and filter tests:

```gherkin
@smoke @critical
Scenario: Authenticate with valid credentials
  ...

@slow @integration
Scenario: Process large message history
  ...

@wip
Scenario: Feature in development
  ...
```

**Common Tags**:
- `@smoke` - Critical path tests (run first)
- `@critical` - Must pass before deployment
- `@slow` - Takes >5 seconds
- `@integration` - Requires external services
- `@wip` - Work in progress (skip in CI)

---

## Test Maintenance

### When Specs Change

**Spec Manager refines spec** → **Test Writer updates tests**

**Process**:
1. Review spec changes
2. Identify affected scenarios
3. Update/add/remove scenarios
4. Verify coverage is complete
5. Run tests to ensure they work

**Example**:
```
Spec Change: AC-3 added "Names must be unique per user"

Test Update: Add scenario:
  Scenario: Reject duplicate channel name
    Given I have a channel named "Work Project"
    When I create another channel with name "Work Project"
    Then I should receive an "error" message
    And the error should indicate name already exists
```

---

### When Tests Fail

**Test failure indicates one of three things:**

1. **Bug in implementation** → Developer fixes code
2. **Test is wrong** → Test Writer fixes test
3. **Spec is wrong** → Spec Manager refines spec

**Process**:
1. Analyze failure reason
2. Determine root cause
3. Fix at appropriate level
4. Verify fix resolves issue

---

## Tools & Frameworks

### Recommended Stack

**For Node.js/TypeScript**:
- **Cucumber.js** - Gherkin test framework
- **Chai** - Assertion library
- **WebSocket Client** - For testing WebSocket API
- **MongoDB Memory Server** - For isolated database tests

**Alternative**:
- **Vitest** with Gherkin plugin
- **Jest** with Cucumber preprocessor

---

### Step Definitions

Tests require step definitions (implementation of Given/When/Then):

```typescript
// Example step definition (Cucumber.js)
import { Given, When, Then } from '@cucumber/cucumber';

Given('I am authenticated as {string}', async function(email: string) {
  await this.authenticate(email);
});

When('I send a message:', async function(dataTable) {
  const message = dataTable.rowsHash();
  this.response = await this.sendMessage(message);
});

Then('I should receive a {string} message', async function(messageType: string) {
  expect(this.response.type).to.equal(messageType);
});
```

---

## Checklist for Test Writers

Before marking tests as complete, verify:

**Coverage**:
- [ ] Every acceptance criterion has at least one scenario
- [ ] Happy path is covered
- [ ] Error cases are covered
- [ ] Edge cases are covered
- [ ] Validation rules are tested

**Quality**:
- [ ] Scenarios are independent
- [ ] Tests are deterministic
- [ ] Steps are clear and concise
- [ ] Data tables are used appropriately
- [ ] No implementation details leaked

**Maintainability**:
- [ ] File is in correct namespace directory
- [ ] Filename matches spec filename
- [ ] Feature description matches spec
- [ ] Comments reference AC numbers
- [ ] Tags are applied appropriately

---

## Related Documents

- [SPEC-DRIVEN-WORKFLOW.md](./SPEC-DRIVEN-WORKFLOW.md) - Overall development workflow
- [SPEC-FORMAT.md](./SPEC-FORMAT.md) - How to write specifications
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture context
- [CODE-STYLE.md](./CODE-STYLE.md) - Code conventions

---

**Ready to write tests? Start with a spec and cover every acceptance criterion!** 🧪

---

## Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2026-05-16 | Initial version | Pablo López Torres / Alice Evergreen |
