/**
 * Advanced compound interest calculator inputs
 */
export interface SwpInputs {
  /** Initial principal amount */
  principal: number;
  /** Annual interest rate (percentage) */
  annualRate: number;
  /** Number of years for investment */
  years: number;
  /** Additional contribution per period (optional) */
  monthlyWithDrawal: number;
}
