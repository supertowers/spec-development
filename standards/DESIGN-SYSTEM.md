# Design System — UI/UX Principles

| Field | Value |
|-------|-------|
| **Version** | 1.0.0 |
| **Status** | Active |
| **Author** | Pablo López Torres / Alice Evergreen |

---

## Purpose

This document defines the design principles, aesthetic direction, and UI/UX standards that apply to every product interface we build. These are not suggestions — they are the baseline that makes our work coherent and recognizable.

---

## Part I — Design Principles

### 1. Intentionality Over Defaults

Every visual decision must be deliberate. There are no "default" choices — if you use a font, color, or spacing value, you must be able to explain why that specific choice serves the design.

**This means:**
- Never use system fonts (Inter, Arial, Roboto, -apple-system) unless the product explicitly requires it
- Never use purple gradients on white backgrounds — this is the most overused "AI aesthetic" and must be avoided
- Never copy component patterns from generic UI kits without adapting them to the product's character

### 2. Commit to an Aesthetic Direction

Every interface must have a clear, named aesthetic direction. Pick one and execute it with precision. Vague, "balanced" designs that try to be everything end up being nothing.

**Valid directions (examples — not exhaustive):**
- Brutalist / raw / high-contrast
- Refined / editorial / typographic
- Organic / warm / textured
- Industrial / utilitarian / data-dense
- Playful / toy-like / tactile
- Luxury / minimal / restrained

**The test:** can you describe the aesthetic in two words? If not, it's not committed enough.

### 3. Typography Is the Foundation

Typography carries more visual weight than color. A well-chosen type pairing makes an interface feel designed even before any color is applied.

**Rules:**
- Always pair a distinctive display/heading font with a refined body font
- Display fonts: choose for character, not legibility (legibility is for body text)
- Body fonts: optimize for reading comfort at 14-16px
- Mono fonts: use for code, data, IDs, and timestamps — never for body text
- Never use more than 3 font families in one interface

**Our default type stack:**
- Display / headings: `Newsreader` (serif, editorial)
- UI / body: `DM Sans` (clean, friendly, not generic)
- Code / data: `JetBrains Mono`

### 4. Color With Conviction

**Rules:**
- Define a palette of 3-5 colors maximum (background, surface, text, accent, semantic)
- Use CSS custom properties (`--color-*`) for every color — no hardcoded hex values in components
- Dominant colors with sharp accents outperform timid, evenly-distributed palettes
- Light and dark themes must both be intentional — dark is not just "invert light"

**Semantic colors (consistent across all projects):**
- `--color-success`: green (completion, done)
- `--color-warning`: amber/orange (caution, in-progress)
- `--color-error`: red (failure, blocked)
- `--color-info`: blue (neutral information)

**Our brand accent:** Indigo `#5E6AD2` — never pure blue (`#0000FF`)

### 5. Motion With Purpose

Animation must earn its place. Every transition must either:
- Communicate state change (something happened)
- Guide attention (look here next)
- Provide feedback (your action was registered)

**Rules:**
- CSS-only animations preferred over JavaScript for simple transitions
- Staggered reveals on page load (animation-delay) create more delight than scattered micro-interactions
- Duration: 150ms for micro (hover, focus), 250ms for transitions, 400ms for page-level
- Easing: `ease-out` for entrances, `ease-in` for exits, `ease-in-out` for transforms
- Never animate layout properties (width, height, top, left) — use `transform` and `opacity`

### 6. Spatial Composition

**Rules:**
- Use a base spacing unit of 4px — all spacing values are multiples of 4
- Generous negative space is almost always better than cramped density
- Asymmetry and unexpected layouts are more memorable than centered grids
- Grid-breaking elements (overlapping, bleeding, diagonal) signal craft
- Consistent padding within a component family; deliberate variation between sections

---

## Part II — UX Principles

### 1. User Journey First

Before designing any screen, map the complete user journey:
- Entry point: how does the user arrive at this feature?
- Happy path: the most common sequence of steps
- Error paths: what happens when something goes wrong?
- Exit point: where does the user go after completing the task?

No screen should be designed in isolation from its context in the journey.

### 2. Every State Must Be Designed

A feature is not complete until all states are designed:
- **Empty state**: first time, no data
- **Loading state**: data is being fetched
- **Error state**: something went wrong
- **Partial state**: some data, some missing
- **Full state**: the normal case with data
- **Edge cases**: very long text, many items, special characters

Skipping states is how you ship broken experiences.

### 3. Wireframe Before Visual Design

User journey and structure must be validated before visual design begins.

**Order of operations:**
1. User journey map (text/prose)
2. ASCII wireframes (structure, not aesthetics)
3. User validation of wireframes
4. Visual prototype (HTML/CSS)
5. User validation of visual design
6. Implementation

Skipping steps 1-3 wastes design and engineering time.

### 4. Prototypes Are Static

UI prototypes are static HTML/CSS. No JavaScript logic. No API calls. No state management.

**Why:**
- Forces clear separation between design and implementation
- Allows non-technical stakeholders to validate without running a development environment
- Prevents premature implementation decisions from contaminating the design

**The rule:** if a prototype requires JavaScript to demonstrate a design, the design is not yet clear enough to prototype.

### 5. Accessibility Is Not Optional

Every interface must meet WCAG 2.1 AA as a minimum:
- Color contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text
- All interactive elements are keyboard-accessible
- Focus states are visible and styled
- Images have alt text
- Forms have associated labels
- Error messages are descriptive and associated with their input

---

## Part III — Component Standards

### Naming Conventions

Components are named in `PascalCase`. Props use `camelCase`. CSS classes use `kebab-case`.

```
Button, InputField, Modal, Dropdown, Badge, Card, Toast
```

### Component Anatomy

Every component has:
- A default state
- A hover/focus state
- A disabled state
- An error state (if it can fail)
- A loading state (if it has async behavior)

### Token Reference

All visual values come from CSS custom properties:

```css
/* Backgrounds */
--bg-page       /* outermost page background */
--bg-surface    /* cards, panels, sidebars */
--bg-card       /* nested cards */
--bg-overlay    /* modals, tooltips */

/* Text */
--text          /* primary text */
--text-2        /* secondary text */
--text-3        /* tertiary / placeholder */
--text-disabled /* disabled state */

/* Borders */
--border        /* default border */
--border-strong /* emphasized border */

/* Shadows */
--shadow        /* card/panel shadow */
--shadow-sm     /* subtle shadow */
--shadow-lg     /* elevated elements */

/* Radius */
--radius        /* default border radius (8px) */
--radius-sm     /* small radius (4px) */
--radius-lg     /* large radius (12px) */
--radius-full   /* pill / circular */

/* Spacing (4px base unit) */
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px
```

---

## Part IV — Dark vs Light

We are **dark-first** for product interfaces. Landing pages and marketing surfaces may use light themes.

**Dark theme defaults:**
- Page background: `#0A0A0F`
- Surface: `#0E0E13`
- Card: `#16161D`
- Text: `#F0EEE8`
- Text-2: `#9B99A4`

**Light theme defaults:**
- Page background: `#EFE9DB`
- Surface: `#E8E1D0`
- Card: `rgba(250, 250, 250, 0.60)` (semi-transparent over cream)
- Text: `#1A1A1A`
- Text-2: `#6B6B6B`

---

## Checklist — Before Shipping Any UI

- [ ] Aesthetic direction is named and committed
- [ ] Typography uses our standard type stack (or a deliberate deviation is documented)
- [ ] All colors use CSS custom properties — no hardcoded hex in components
- [ ] All states are designed (empty, loading, error, full)
- [ ] Wireframes were validated before visual design
- [ ] Prototype is static HTML/CSS (no JS logic)
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] All interactive elements are keyboard-accessible
- [ ] Focus states are visible
- [ ] Motion has purpose (every animation can be justified)
