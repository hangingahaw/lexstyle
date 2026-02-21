import { describe, expect, it } from 'vitest'
import { serialize } from '../src/serialize.js'
import type { StyleSheet } from '../src/types.js'

describe('serialize', () => {
  it('serializes a single category with one rule', () => {
    const sheet: StyleSheet = {
      dashes: {
        rules: [{ description: 'Use em dashes for asides.' }],
      },
    }
    expect(serialize(sheet)).toBe('## Dashes\nUse em dashes for asides.')
  })

  it('serializes a single rule with examples', () => {
    const sheet: StyleSheet = {
      dashes: {
        rules: [
          {
            description: 'Use em dashes for asides.',
            examples: ['The court held\u2014in a ruling\u2014that...'],
          },
        ],
      },
    }
    expect(serialize(sheet)).toBe(
      '## Dashes\nUse em dashes for asides.\n  e.g. "The court held\u2014in a ruling\u2014that..."',
    )
  })

  it('serializes multiple rules with blank line separators', () => {
    const sheet: StyleSheet = {
      dashes: {
        rules: [
          { description: 'Rule one.' },
          { description: 'Rule two.' },
        ],
      },
    }
    expect(serialize(sheet)).toBe('## Dashes\nRule one.\n\nRule two.')
  })

  it('serializes multiple categories in fixed order regardless of object key order', () => {
    const sheet: StyleSheet = {
      symbols: { rules: [{ description: 'Symbol rule.' }] },
      dashes: { rules: [{ description: 'Dash rule.' }] },
    }
    const result = serialize(sheet)
    const dashIndex = result.indexOf('## Dashes')
    const symbolIndex = result.indexOf('## Symbols')
    expect(dashIndex).toBeLessThan(symbolIndex)
  })

  it('filters to a specific category', () => {
    const sheet: StyleSheet = {
      dashes: { rules: [{ description: 'Dash rule.' }] },
      spacing: { rules: [{ description: 'Spacing rule.' }] },
    }
    const result = serialize(sheet, 'dashes')
    expect(result).toBe('## Dashes\nDash rule.')
    expect(result).not.toContain('Spacing')
  })

  it('returns empty string for empty sheet', () => {
    expect(serialize({})).toBe('')
  })

  it('omits category with empty rules array', () => {
    const sheet: StyleSheet = {
      dashes: { rules: [] },
      spacing: { rules: [{ description: 'Spacing rule.' }] },
    }
    const result = serialize(sheet)
    expect(result).not.toContain('Dashes')
    expect(result).toContain('Spacing')
  })

  it('returns empty string when filtered category is missing', () => {
    const sheet: StyleSheet = {
      dashes: { rules: [{ description: 'Dash rule.' }] },
    }
    expect(serialize(sheet, 'spacing')).toBe('')
  })

  it('returns empty string when filtered category has empty rules', () => {
    const sheet: StyleSheet = {
      dashes: { rules: [] },
    }
    expect(serialize(sheet, 'dashes')).toBe('')
  })

  it('includes category description after header', () => {
    const sheet: StyleSheet = {
      dashes: {
        description: 'Follow Chicago style.',
        rules: [{ description: 'Use em dashes.' }],
      },
    }
    const result = serialize(sheet)
    expect(result).toBe(
      '## Dashes\nFollow Chicago style.\n\nUse em dashes.',
    )
  })

  it('produces no trailing whitespace on any line', () => {
    const sheet: StyleSheet = {
      dashes: {
        description: 'Dash conventions.',
        rules: [
          {
            description: 'Use em dashes.',
            examples: ['example one', 'example two'],
          },
          { description: 'Use en dashes for ranges.' },
        ],
      },
    }
    const result = serialize(sheet)
    for (const line of result.split('\n')) {
      expect(line).toBe(line.trimEnd())
    }
  })

  it('has no trailing newline at end of output', () => {
    const sheet: StyleSheet = {
      dashes: {
        rules: [{ description: 'Rule.' }],
      },
    }
    const result = serialize(sheet)
    expect(result).not.toMatch(/\n$/)
  })

  it('separates multiple categories with a blank line', () => {
    const sheet: StyleSheet = {
      dashes: { rules: [{ description: 'Dash rule.' }] },
      spacing: { rules: [{ description: 'Space rule.' }] },
    }
    const result = serialize(sheet)
    expect(result).toContain('Dash rule.\n\n## Spacing')
  })

  it('escapes double quotes in examples', () => {
    const sheet: StyleSheet = {
      dashes: {
        rules: [
          {
            description: 'Use em dashes.',
            examples: ['She said "hello" to him.'],
          },
        ],
      },
    }
    const result = serialize(sheet)
    expect(result).toContain('  e.g. "She said \\"hello\\" to him."')
  })

  it('is deterministic — same input always produces same output', () => {
    const sheet: StyleSheet = {
      dashes: {
        description: 'Dash rules.',
        rules: [
          {
            description: 'Use em dashes.',
            examples: ['test\u2014example'],
          },
          { description: 'Use en dashes for ranges.' },
        ],
      },
      spacing: {
        rules: [{ description: 'Single space after period.' }],
      },
    }
    const a = serialize(sheet)
    const b = serialize(sheet)
    expect(a).toBe(b)
  })
})
