

/**
 * Yearly summary of SIP investment
 */
export interface SIPYearlyBreakdown {
  /** Year */
  year: number;
  
  /** Amount invested during this year */
  yearlyInvestment: number;

  /** Interest earned during this year(without inflation) */
  yearlyInterest: number;

  /** Inflation-adjusted interest earned during this year (if inflation rate was provided) */
  inflationAdjustedYearlyInterest: number;

  /** Year-end value of the investment (without inflation adjustment) */
  yearEndMaturity: number;

  /** Inflation-adjusted year-end value of the investment (if inflation rate was provided) */
  inflationAdjustedYearEndMaturity: number;
}

/**
 * Results of SIP calculation
 */
export interface SIPCalculationResult {
  /** Total amount invested over the entire period */
  totalInvestedAmount: number;
  
  /** Maturity amount (without inflation adjustment) */
  maturityAmount: number;
  
  /** Inflation-adjusted maturity amount (if inflation rate was provided) */
  inflationAdjustedMaturityAmount?: number;
  
  /** Wealth gain (maturity amount - invested amount) */
  wealthGain: number;
  
  /** Inflation-adjusted wealth gain (if inflation rate was provided) */
  inflationAdjustedWealthGain?: number;
  
  /** Yearly summary of the investment */
  yearlyBreakdown: SIPYearlyBreakdown[];
}
