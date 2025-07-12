/**
 * Advanced compound interest calculator inputs
 */
export interface CompoundInterestInputs {
  /** Initial principal amount */
  principal: number;
  /** Annual interest rate (percentage) */
  annualRate: number;
  /** Compounding frequency per year (e.g., 12 for monthly, 4 for quarterly) */
  compoundingFrequency: number;
  /** Number of years for investment */
  years: number;
  /** Additional contribution per period (optional) */
  additionalContribution?: number;
}
