import { CATEGORY_ORDER } from './types.js'
import type { CategoryRule, RuleCategory, StyleSheet } from './types.js'

function cloneRule(rule: CategoryRule): CategoryRule {
  const clone: CategoryRule = { description: rule.description }
  if (rule.examples) {
    clone.examples = [...rule.examples]
  }
  return clone
}

function mergeCategory(
  base: RuleCategory | undefined,
  override: RuleCategory | undefined,
): RuleCategory | undefined {
  if (override === undefined) {
    if (base === undefined) return undefined
    return {
      ...base,
      rules: base.rules.map(cloneRule),
    }
  }

  return {
    description: override.description ?? base?.description,
    rules: override.rules.map(cloneRule),
  }
}

/**
 * Deep-merge a base StyleSheet with one or more overrides.
 *
 * - Categories not mentioned in an override are preserved from base
 * - `undefined` values in an override are ignored (category preserved)
 * - `rules` arrays are replaced wholesale (not concatenated)
 * - Returns a new object — no mutation of base or any override
 */
export function merge(
  base: StyleSheet,
  ...overrides: Partial<StyleSheet>[]
): StyleSheet {
  let result: StyleSheet = {}

  for (const key of CATEGORY_ORDER) {
    const cat = mergeCategory(base[key], undefined)
    if (cat !== undefined) {
      result[key] = cat
    }
  }

  for (const override of overrides) {
    const next: StyleSheet = {}

    for (const key of CATEGORY_ORDER) {
      const hasKey = Object.prototype.hasOwnProperty.call(override, key)
      const overrideVal = hasKey ? override[key] : undefined
      const baseVal = result[key]

      if (hasKey) {
        const merged = mergeCategory(baseVal, overrideVal)
        if (merged !== undefined) {
          next[key] = merged
        }
      } else if (baseVal !== undefined) {
        next[key] = { ...baseVal, rules: baseVal.rules.map(cloneRule) }
      }
    }

    result = next
  }

  return result
}
