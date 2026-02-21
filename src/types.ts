/** A single rule within a category */
export interface CategoryRule {
  description: string
  examples?: string[]
}

/** A category of rules (e.g. dashes, spacing, capitalization) */
export interface RuleCategory {
  description?: string
  rules: CategoryRule[]
}

/** The full style sheet — one optional category per key */
export interface StyleSheet {
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

/** Known category names */
export type CategoryName = keyof StyleSheet

/** Known category names — fixed order for deterministic serialization */
export const CATEGORY_ORDER = [
  'dashes',
  'spacing',
  'punctuation',
  'capitalization',
  'numbers',
  'abbreviations',
  'lists',
  'citations',
  'titles',
  'symbols',
] as const satisfies readonly CategoryName[]
