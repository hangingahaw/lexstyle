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

  punctuation: {
    description: 'Canonical punctuation conventions for formal and legal writing.',
    rules: [
      {
        description:
          'Use the Oxford (serial) comma before the final item in a list of three or more.',
        examples: [
          'The court considered standing, ripeness, and mootness.',
          'Plaintiff alleged fraud, breach of contract, and negligence.',
        ],
      },
      {
        description:
          'Place commas and periods inside closing quotation marks (American style).',
        examples: [
          'The witness stated, "I saw the defendant."',
          'The statute defines "person," "entity," and "corporation."',
        ],
      },
      {
        description:
          'Place colons and semicolons outside closing quotation marks.',
        examples: [
          'The court interpreted "reasonable"; however, it did not define the term.',
          'The brief addressed three "key issues": standing, ripeness, and mootness.',
        ],
      },
      {
        description:
          'Use a comma before "which" (nonrestrictive clause) but not before "that" (restrictive clause).',
        examples: [
          'The statute, which was enacted in 2020, applies retroactively.',
          'The statute that was enacted in 2020 applies retroactively.',
        ],
      },
      {
        description:
          'Use a semicolon to separate items in a list when individual items contain commas.',
        examples: [
          'The court considered: standing, which was contested; ripeness, which was conceded; and mootness.',
        ],
      },
      {
        description:
          'Use a colon after a complete clause to introduce a list, explanation, or quotation. Do not use a colon after a sentence fragment.',
        examples: [
          'The court identified three factors: standing, ripeness, and mootness.',
        ],
      },
      {
        description:
          'Use an apostrophe for possessives, including singular nouns ending in "s" (add \'s).',
        examples: [
          "the witness's testimony",
          "Congress's intent",
          "the court's ruling",
        ],
      },
    ],
  },

  capitalization: {
    description: 'Canonical capitalization conventions for formal and legal writing.',
    rules: [
      {
        description:
          'Capitalize the full formal name of a court; lowercase informal or subsequent references.',
        examples: [
          'The Supreme Court of the United States held that the statute was valid.',
          'The court further noted that precedent supported the ruling.',
        ],
      },
      {
        description:
          'Capitalize "Court" when referring to the United States Supreme Court, even in short form.',
        examples: [
          'The Court held that the statute was constitutional.',
        ],
      },
      {
        description:
          'Capitalize defined terms as they appear in the agreement or statute.',
        examples: [
          'The "Agreement" shall be governed by New York law.',
          'The Buyer shall notify the Seller within thirty days.',
        ],
      },
      {
        description:
          'Capitalize headings and subheadings in title case or full caps as appropriate to their level.',
        examples: [
          'ARTICLE III \u2014 REMEDIES',
          'Section 3.1 \u2014 Indemnification',
        ],
      },
      {
        description:
          'Capitalize proper nouns, including names of statutes, acts, and constitutional provisions.',
        examples: [
          'the First Amendment',
          'the Sarbanes-Oxley Act',
          'the Due Process Clause',
        ],
      },
      {
        description:
          'Lowercase generic references to legal concepts and document parts.',
        examples: [
          'the plaintiff filed a motion',
          'the above section provides',
          'the amendment was ratified',
        ],
      },
      {
        description:
          'In headings, capitalize all words of four or more letters. Capitalize shorter words only if they are the first or last word, or a verb, noun, pronoun, adjective, or adverb.',
        examples: [
          'Motion to Dismiss for Failure to State a Claim',
          'Brief in Support of Summary Judgment',
        ],
      },
    ],
  },

  citations: {
    description: 'Canonical Bluebook citation conventions for legal writing.',
    rules: [
      {
        description:
          'Italicize case names in full citations. Use the format: Case Name, Volume Reporter Page (Court Year).',
        examples: [
          '*Marbury v. Madison*, 5 U.S. (1 Cranch) 137 (1803).',
          '*Brown v. Board of Education*, 347 U.S. 483 (1954).',
        ],
      },
      {
        description:
          'Abbreviate reporter names according to Bluebook T6: "U.S." not "US", "S. Ct." not "S.Ct."',
        examples: [
          '553 U.S. 35',
          '128 S. Ct. 1203',
          '200 L. Ed. 2d 889',
        ],
      },
      {
        description:
          'Use proper short-form citations: "Id." when citing the immediately preceding authority; "Id. at [page]" for a different page.',
        examples: [
          'Id.',
          'Id. at 142.',
        ],
      },
      {
        description:
          'Italicize introductory signals: See, See also, Cf., But see, Accord, E.g., Compare.',
        examples: [
          '*See* *Brown*, 347 U.S. at 495.',
          '*Cf.* *Plessy v. Ferguson*, 163 U.S. 537 (1896).',
        ],
      },
      {
        description:
          'Use proper statutory citation format: Title [Code] \u00a7 [Section].',
        examples: [
          '42 U.S.C. \u00a7 1983',
          '28 U.S.C. \u00a7 1331',
          '17 C.F.R. \u00a7 240.10b-5',
        ],
      },
      {
        description:
          'Use a pinpoint cite (pincite) to reference specific pages within a source.',
        examples: [
          '*Marbury*, 5 U.S. at 177.',
          '*Brown*, 347 U.S. at 495.',
        ],
      },
      {
        description:
          'Use an en dash (\u2013) for page spans in citations, not a hyphen.',
        examples: [
          '553 U.S. 35\u201342',
          '128 S. Ct. 1203\u20131210',
        ],
      },
    ],
  },
})
