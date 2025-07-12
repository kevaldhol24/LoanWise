/**
 * Yearly breakdown for goal-based SIP calculator
 */
export interface GoalBasedSIPScheduleItem {
  /** Year number */
  year: number;
  /** Total investment made till this year */
  totalInvestment: number;
  /** Value accumulated till this year */
  accumulatedValue: number;
}
