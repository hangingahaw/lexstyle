import type { StyleSheet } from './types.js'

function deepFreeze<T extends object>(obj: T): T {
  Object.freeze(obj)
  for (const value of Object.values(obj)) {
    if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value)
    }
  }
  return obj
}

/**
 * The canonical rule set. One authoritative StyleSheet — no presets, no conflicts.
 * Categories are populated incrementally (dashes in v0.1.0, more to follow).
 * Users override individual rules via merge() for local preferences.
 *
 * This object is deeply frozen at runtime. Attempting to mutate it will throw
 * in strict mode or silently fail in sloppy mode.
 */
export const rules: Readonly<StyleSheet> = deepFreeze({
  dashes: {
    description: 'Canonical dash conventions for formal and legal writing.',
    rules: [
      {
        description:
          'Use an em dash (\u2014) for parenthetical asides, with no spaces on either side.',
        examples: [
          'The court held\u2014in a landmark ruling\u2014that the statute was unconstitutional.',
          'Three defendants\u2014Smith, Jones, and Lee\u2014were acquitted.',
        ],
      },
      {
        description:
          'Use an en dash (\u2013) for number ranges, including pages and dates.',
        examples: [
          'See pp. 45\u201367',
          'the 2020\u20132024 period',
        ],
      },
      {
        description:
          'Use an en dash (\u2013) for page spans in legal citations.',
        examples: [
          '553 U.S. 35\u201342',
          '128 S. Ct. 1203\u20131210',
        ],
      },
      {
        description:
          'Use a hyphen (-) for compound modifiers before a noun, and for standard prefixes and suffixes.',
        examples: [
          'a well-known precedent',
          'the first-place finisher',
          'self-evident truth',
          'cross-examination',
        ],
      },
      {
        description:
          'Use a hyphen in spelled-out number compounds from twenty-one through ninety-nine.',
        examples: ['twenty-one', 'sixty-four', 'ninety-nine'],
      },
      {
        description:
          'Use an en dash (\u2013) for compound adjectives when one element is a multi-word proper noun or already hyphenated.',
        examples: [
          'post\u2013Cold War era',
          'New York\u2013based firm',
          'a pre\u2013Civil War statute',
        ],
      },
      {
        description:
          'Keep hyphens (not en dashes) in vote tallies and case-name compounds.',
        examples: [
          'a 5-4 decision',
          'the 7-2 ruling',
          'the Chevron-deference doctrine',
        ],
      },
    ],
  },
})
