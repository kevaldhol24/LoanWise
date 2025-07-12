/**
 * Compound interest calculation output
 */
export interface SwpOutput {
  /** Initial principal amount */
  principal: number;
  /** Total amount after compounding */
  totalAmount: number;
  /** Total interest earned */
  totalInterest: number;
  /** Total withdrawals made */
  totalWithdrawals: number;
  /** Detailed schedule of compounding */
  schedule: SwpScheduleItem[];
}

/**
 * Compound interest schedule item
 */
export interface SwpScheduleItem {
  /** Year of compounding */
  year: number;

  /** Month of compounding */
  month: number;

  withdrawal: number;

  interest: number;

  startingAmount: number;

  /** Amount at this period */
  closingAmount: number;
}
