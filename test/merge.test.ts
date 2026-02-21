import { describe, expect, it } from 'vitest'
import { merge } from '../src/merge.js'
import type { StyleSheet } from '../src/types.js'

describe('merge', () => {
  const base: StyleSheet = {
    dashes: {
      description: 'Base dash rules.',
      rules: [
        { description: 'Rule A.' },
        { description: 'Rule B.' },
      ],
    },
    spacing: {
      rules: [{ description: 'Single space after period.' }],
    },
  }

  it('overrides one category\'s rules', () => {
    const result = merge(base, {
      dashes: {
        description: 'Override dash rules.',
        rules: [{ description: 'Override rule.' }],
      },
    })
    expect(result.dashes!.rules).toHaveLength(1)
    expect(result.dashes!.rules[0].description).toBe('Override rule.')
    expect(result.dashes!.description).toBe('Override dash rules.')
  })

  it('replaces rules array (not concat)', () => {
    const result = merge(base, {
      dashes: {
        rules: [{ description: 'Only rule.' }],
      },
    })
    expect(result.dashes!.rules).toHaveLength(1)
  })

  it('preserves unmentioned categories from base', () => {
    const result = merge(base, {
      dashes: {
        rules: [{ description: 'New rule.' }],
      },
    })
    expect(result.spacing).toBeDefined()
    expect(result.spacing!.rules[0].description).toBe(
      'Single space after period.',
    )
  })

  it('applies multiple override layers left-to-right', () => {
    const result = merge(
      base,
      { dashes: { rules: [{ description: 'Layer 1.' }] } },
      { dashes: { rules: [{ description: 'Layer 2.' }] } },
    )
    expect(result.dashes!.rules[0].description).toBe('Layer 2.')
  })

  it('overrides category description', () => {
    const result = merge(base, {
      dashes: {
        description: 'New description.',
        rules: [{ description: 'Rule.' }],
      },
    })
    expect(result.dashes!.description).toBe('New description.')
  })

  it('preserves base description when override omits it', () => {
    const result = merge(base, {
      dashes: {
        rules: [{ description: 'Rule.' }],
      },
    })
    expect(result.dashes!.description).toBe('Base dash rules.')
  })

  it('ignores undefined category in override (preserves from base)', () => {
    const result = merge(base, { dashes: undefined } as Partial<StyleSheet>)
    expect(result.dashes).toBeDefined()
    expect(result.dashes!.rules).toHaveLength(2)
  })

  it('returns clone of base for empty override', () => {
    const result = merge(base, {})
    expect(result).toEqual(base)
    expect(result).not.toBe(base)
  })

  it('does not mutate the base object', () => {
    const baseCopy = JSON.parse(JSON.stringify(base))
    merge(base, {
      dashes: { rules: [{ description: 'Override.' }] },
    })
    expect(base).toEqual(baseCopy)
  })

  it('does not mutate the override object', () => {
    const override = {
      dashes: { rules: [{ description: 'Override.' }] },
    }
    const overrideCopy = JSON.parse(JSON.stringify(override))
    merge(base, override)
    expect(override).toEqual(overrideCopy)
  })

  it('returns a new rules array reference', () => {
    const override = {
      dashes: { rules: [{ description: 'Override.' }] },
    }
    const result = merge(base, override)
    expect(result.dashes!.rules).not.toBe(base.dashes!.rules)
    expect(result.dashes!.rules).not.toBe(override.dashes.rules)
  })

  it('returns cloned rule objects (not same reference as base)', () => {
    const result = merge(base, {})
    expect(result.dashes!.rules[0]).not.toBe(base.dashes!.rules[0])
    expect(result.dashes!.rules[0]).toEqual(base.dashes!.rules[0])
  })

  it('mutating result examples does not affect base', () => {
    const baseWithExamples: StyleSheet = {
      dashes: {
        rules: [{ description: 'Rule.', examples: ['original'] }],
      },
    }
    const result = merge(baseWithExamples, {})
    result.dashes!.rules[0].examples!.push('mutated')
    expect(baseWithExamples.dashes!.rules[0].examples).toEqual(['original'])
  })

  it('mutating result examples does not affect override', () => {
    const override = {
      dashes: {
        rules: [{ description: 'Rule.', examples: ['original'] }],
      },
    }
    const result = merge(base, override)
    result.dashes!.rules[0].examples!.push('mutated')
    expect(override.dashes.rules[0].examples).toEqual(['original'])
  })

  it('handles empty rules array override', () => {
    const result = merge(base, {
      dashes: { rules: [] },
    })
    expect(result.dashes!.rules).toHaveLength(0)
  })

  it('adds a new category not present in base', () => {
    const result = merge(base, {
      punctuation: {
        description: 'Punctuation rules.',
        rules: [{ description: 'Oxford comma always.' }],
      },
    })
    expect(result.punctuation).toBeDefined()
    expect(result.punctuation!.rules[0].description).toBe(
      'Oxford comma always.',
    )
    expect(result.dashes).toBeDefined()
    expect(result.spacing).toBeDefined()
  })
})
