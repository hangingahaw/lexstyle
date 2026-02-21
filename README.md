# lexstyle

Structured typography rules for LLM-based text correction.

lexstyle defines editorial rules as typed data and serializes them into deterministic plain text that language models can follow. It ships one canonical rule set with layered overrides for local preferences.

## Install

```sh
npm install lexstyle
```

## Quick start

```ts
import { rules, serialize } from 'lexstyle'

// Serialize all dash rules into an LLM-consumable string
const prompt = serialize(rules, 'dashes')
```

Output:

```
## Dashes
Canonical dash conventions for formal and legal writing.

Use an em dash (—) for parenthetical asides, with no spaces on either side.
  e.g. "The court held—in a landmark ruling—that the statute was unconstitutional."
  e.g. "Three defendants—Smith, Jones, and Lee—were acquitted."

Use an en dash (–) for number ranges, including pages and dates.
  e.g. "See pp. 45–67"
  e.g. "the 2020–2024 period"

...
```

Pass this string as the `rules` option to any LLM-based correction tool:

```ts
import { redashify } from 'redashify'

const result = await redashify(text, {
  apiKey: process.env.OPENAI_API_KEY,
  rules: serialize(rules, 'dashes'),
})
```

## Overriding rules

Use `merge()` to layer local preferences over the canonical set. Overrides replace the rules array for a category — they don't concatenate.

```ts
import { rules, merge, serialize } from 'lexstyle'

// Override: use spaces around em dashes
const local = merge(rules, {
  dashes: {
    rules: [
      ...rules.dashes!.rules.filter(r => !r.description.includes('em dash')),
      {
        description: 'Use an em dash (—) with a space on each side.',
        examples: ['The court — in a landmark ruling — held that...'],
      },
    ],
  },
})

serialize(local, 'dashes')
```

Multiple overrides apply left-to-right:

```ts
const sheet = merge(rules, firmDefaults, matterOverrides)
```

`merge()` never mutates its inputs. The returned object is fully detached — mutating it will not affect the base or any override.

## API

### `serialize(sheet, category?)`

Serialize a `StyleSheet` into deterministic plain text.

| Parameter | Type | Description |
|---|---|---|
| `sheet` | `StyleSheet` | The style sheet to serialize |
| `category` | `CategoryName` | Optional — serialize only this category |

Returns `string`. Empty string if the sheet or category has no rules.

Output is deterministic: categories always appear in a fixed order, with no trailing whitespace or trailing newline. Safe for prompt caching and snapshot testing.

### `merge(base, ...overrides)`

Deep-merge a base `StyleSheet` with one or more partial overrides.

| Parameter | Type | Description |
|---|---|---|
| `base` | `StyleSheet` | The base style sheet |
| `...overrides` | `Partial<StyleSheet>[]` | Overrides applied left-to-right |

Returns a new `StyleSheet`. No mutation of any input.

Merge semantics:
- Override a category's `rules` → replaces the array (not append)
- Override a category's `description` → replaces the string
- Omit a category → preserved from base
- Set `rules: []` → category won't serialize (effectively disabled)

### `rules`

The canonical `StyleSheet`. One authoritative set of rules — no conflicting presets. Deeply frozen at runtime; attempting to mutate it will throw in strict mode.

v0.1.0 ships the `dashes` category (7 rules). Additional categories will be added in future versions.

### `CATEGORY_ORDER`

```ts
const CATEGORY_ORDER: readonly [
  'dashes', 'spacing', 'punctuation', 'capitalization',
  'numbers', 'abbreviations', 'lists', 'citations', 'titles', 'symbols'
]
```

Fixed iteration order used by `serialize()`. Guarantees deterministic output regardless of object key order.

## Types

```ts
interface CategoryRule {
  description: string     // LLM-readable instruction
  examples?: string[]     // Illustrative examples
}

interface RuleCategory {
  description?: string    // Category-level context
  rules: CategoryRule[]   // The rules
}

interface StyleSheet {
  dashes?: RuleCategory
  spacing?: RuleCategory
  punctuation?: RuleCategory
  capitalization?: RuleCategory
  numbers?: RuleCategory
  abbreviations?: RuleCategory
  lists?: RuleCategory
  citations?: RuleCategory
  titles?: RuleCategory
  symbols?: RuleCategory
}

type CategoryName = keyof StyleSheet
```

## Design decisions

**Rules as data, not regex.** lexstyle produces plain text instructions for language models, not pattern-matching engines. Deterministic tools like [smartquotify](https://github.com/haihang-wang/smartquotify) don't need it — they use regex directly. LLM-based tools like [redashify](https://github.com/haihang-wang/redashify) do.

**One canonical set.** There are no Chicago/Bluebook/AP presets. The rules are the rules. If your local style differs, `merge()` handles that — but there's a single starting point, not a menu of competing conventions.

**Deterministic serialization.** Same input always produces the same output. Categories appear in a fixed order. No trailing whitespace. This matters for prompt caching, snapshot tests, and diffing rule changes over time.

**Deep clone on merge.** `merge()` returns a fully detached object. Mutating the result never leaks back to the base or any override. Every `CategoryRule` and its `examples` array are cloned.

**Immutable canonical rules.** The exported `rules` object is deeply frozen at runtime. No consumer can accidentally corrupt global state. Use `merge()` to derive a modified copy.

## License

Apache-2.0
