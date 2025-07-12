/**
 * Compound interest calculation output
 */
export interface CompoundInterestOutput {
  /** Initial principal amount */
  principal: number;
  /** Total amount after compounding */
  totalAmount: number;
  /** Total interest earned */
  totalInterest: number;
  /** Detailed schedule of compounding */
  schedule: CompoundInterestScheduleItem[];
}

/**
 * Compound interest schedule item
 */
export interface CompoundInterestScheduleItem {
  /** Year of compounding */
  year: number;
  /** Period within the year */
  period: number;
  /** Amount at this period */
  amount: number;

  interest: number

  contribution?: number;
}
