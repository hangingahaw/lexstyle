import { describe, expect, it } from 'vitest'
import { merge } from '../src/merge.js'
import { rules } from '../src/rules.js'
import { serialize } from '../src/serialize.js'
import { CATEGORY_ORDER } from '../src/types.js'

describe('rules', () => {
  it('has non-empty dashes category', () => {
    expect(rules.dashes).toBeDefined()
    expect(rules.dashes!.rules.length).toBeGreaterThan(0)
  })

  it('dashes has at least 5 rules', () => {
    expect(rules.dashes!.rules.length).toBeGreaterThanOrEqual(5)
  })

  it('all rules have non-empty description strings', () => {
    for (const rule of rules.dashes!.rules) {
      expect(rule.description).toBeTruthy()
      expect(typeof rule.description).toBe('string')
      expect(rule.description.length).toBeGreaterThan(0)
    }
  })

  it('serialize(rules, "dashes") produces non-empty string', () => {
    const result = serialize(rules, 'dashes')
    expect(result.length).toBeGreaterThan(0)
    expect(result).toContain('## Dashes')
  })

  it('serialize(rules, "dashes") contains no trailing whitespace', () => {
    const result = serialize(rules, 'dashes')
    for (const line of result.split('\n')) {
      expect(line).toBe(line.trimEnd())
    }
  })

  it('merge(rules, override) works correctly', () => {
    const custom = merge(rules, {
      dashes: {
        description: 'Custom dashes.',
        rules: [{ description: 'Always use em dashes with spaces.' }],
      },
    })
    expect(custom.dashes!.rules).toHaveLength(1)
    expect(custom.dashes!.description).toBe('Custom dashes.')
  })

  it('has em dash rule without spaces', () => {
    const emRule = rules.dashes!.rules.find((r) =>
      r.description.includes('em dash'),
    )
    expect(emRule).toBeDefined()
    expect(emRule!.description).toContain('no spaces')
  })

  it('has vote-tally hyphen rule', () => {
    const voteRule = rules.dashes!.rules.find(
      (r) =>
        r.description.includes('vote') || r.description.includes('tally'),
    )
    expect(voteRule).toBeDefined()
  })

  it('has legal citation page span rule', () => {
    const citationRule = rules.dashes!.rules.find((r) =>
      r.description.includes('legal citation'),
    )
    expect(citationRule).toBeDefined()
  })

  it('en-dash range rule does not mention scores', () => {
    const rangeRule = rules.dashes!.rules.find((r) =>
      r.description.includes('number ranges'),
    )
    expect(rangeRule).toBeDefined()
    expect(rangeRule!.description).not.toContain('score')
  })

  it('only dashes category is populated in v0.1.0', () => {
    const nonDashKeys = CATEGORY_ORDER.filter((k) => k !== 'dashes')
    for (const key of nonDashKeys) {
      expect(rules[key]).toBeUndefined()
    }
  })

  it('rules object is frozen at runtime', () => {
    expect(Object.isFrozen(rules)).toBe(true)
    expect(Object.isFrozen(rules.dashes)).toBe(true)
    expect(Object.isFrozen(rules.dashes!.rules)).toBe(true)
    expect(Object.isFrozen(rules.dashes!.rules[0])).toBe(true)
    expect(Object.isFrozen(rules.dashes!.rules[0].examples)).toBe(true)
  })

  it('rules are not mutated by serialize or merge', () => {
    const copy = JSON.parse(JSON.stringify(rules))
    serialize(rules, 'dashes')
    merge(rules, { dashes: { rules: [{ description: 'test' }] } })
    expect(rules).toEqual(copy)
  })

  it('canonical dashes output matches snapshot', () => {
    expect(serialize(rules, 'dashes')).toMatchInlineSnapshot(`
      "## Dashes
      Canonical dash conventions for formal and legal writing.

      Use an em dash (—) for parenthetical asides, with no spaces on either side.
        e.g. "The court held—in a landmark ruling—that the statute was unconstitutional."
        e.g. "Three defendants—Smith, Jones, and Lee—were acquitted."

      Use an en dash (–) for number ranges, including pages and dates.
        e.g. "See pp. 45–67"
        e.g. "the 2020–2024 period"

      Use an en dash (–) for page spans in legal citations.
        e.g. "553 U.S. 35–42"
        e.g. "128 S. Ct. 1203–1210"

      Use a hyphen (-) for compound modifiers before a noun, and for standard prefixes and suffixes.
        e.g. "a well-known precedent"
        e.g. "the first-place finisher"
        e.g. "self-evident truth"
        e.g. "cross-examination"

      Use a hyphen in spelled-out number compounds from twenty-one through ninety-nine.
        e.g. "twenty-one"
        e.g. "sixty-four"
        e.g. "ninety-nine"

      Use an en dash (–) for compound adjectives when one element is a multi-word proper noun or already hyphenated.
        e.g. "post–Cold War era"
        e.g. "New York–based firm"
        e.g. "a pre–Civil War statute"

      Keep hyphens (not en dashes) in vote tallies and case-name compounds.
        e.g. "a 5-4 decision"
        e.g. "the 7-2 ruling"
        e.g. "the Chevron-deference doctrine""
    `)
  })
})
