
export enum InvestmentFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  HALF_YEARLY = 'half-yearly',
  YEARLY = 'yearly',
}
/**
 * SIP (Systematic Investment Plan) calculator input parameters
 */
export interface SIPCalculatorInputs {
  /** Monthly investment amount (e.g., ₹1000) */
  monthlyInvestment: number;

  /** Expected annual investment return rate (%) */
  annualReturnRate: number;

  /** Investment duration in months */
  durationMonths: number;

  /** Optional: Annual increase in SIP amount (%) */
  stepUpRate?: number;

  /** Optional: Annual inflation rate (%) */
  inflationRate?: number;

  /** Investment frequency default monthly */
  investmentFrequency?: InvestmentFrequency;
}
