import { CATEGORY_ORDER } from './types.js'
import type { CategoryName, RuleCategory, StyleSheet } from './types.js'

function titleCase(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function serializeCategory(name: string, category: RuleCategory): string {
  const lines: string[] = []

  lines.push(`## ${titleCase(name)}`)

  if (category.description) {
    lines.push(category.description)
  }

  for (let i = 0; i < category.rules.length; i++) {
    if (i > 0 || category.description) {
      lines.push('')
    }

    const rule = category.rules[i]
    lines.push(rule.description)

    if (rule.examples) {
      for (const example of rule.examples) {
        lines.push(`  e.g. "${example.replace(/"/g, '\\"')}"`)
      }
    }
  }

  return lines.join('\n')
}

/**
 * Serialize a StyleSheet into deterministic, LLM-consumable plain text.
 *
 * Categories are always emitted in CATEGORY_ORDER. Categories with no rules
 * are omitted. If `category` is specified, only that category is serialized.
 */
export function serialize(sheet: StyleSheet, category?: CategoryName): string {
  const keys = category ? [category] : CATEGORY_ORDER

  const sections: string[] = []

  for (const key of keys) {
    const cat = sheet[key]
    if (!cat || cat.rules.length === 0) continue
    sections.push(serializeCategory(key, cat))
  }

  return sections.join('\n\n')
}
