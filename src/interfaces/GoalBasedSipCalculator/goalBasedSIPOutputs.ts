import { SIPCalculationResult } from "../SipCalculator";

/**
 * Goal-based SIP calculator output
 */
export interface GoalBasedSIPOutput {
    /** Target goal amount */
    goalAmount: number;
    /** Duration in years */
    years: number;
    /** Expected annual rate of return (percentage) */
    annualRate: number;
    /** Total investment required */
    totalInvestment: number;
    /** Monthly SIP amount required */
    monthlyInvestment: number;
    /** Yearly breakdown schedule */
    schedule: SIPCalculationResult["yearlyBreakdown"];
}
