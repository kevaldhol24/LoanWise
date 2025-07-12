/**
 * Goal-based SIP calculator inputs
 */
export interface GoalBasedSIPInputs {
  /** Target goal amount */
  goalAmount: number;
  /** Duration in years */
  years: number;
  /** Expected annual rate of return (percentage) */
  annualRate: number;
  /** Compounding frequency per year (e.g., 12 for monthly, 4 for quarterly, 1 for yearly) */
}
