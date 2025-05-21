/**
 * Monthly breakdown of SIP investment
 */
export interface SIPMonthlyDetail {
  /** Month number (1-based) */
  month: number;
  
  /** Amount invested in this month */
  investmentAmount: number;
  
  /** Interest earned this month (without inflation) */
  interestEarned: number;

  /** Inflation-adjusted interest earned this month (if inflation rate was provided) */
  inflationAdjustedInterestEarned: number;

  /** Investment value at the end of this month */
  endingBalance: number;
}

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

  /** Total value at the end of this year */
  yearEndValue: number;
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
  
  /** Monthly breakdown of the investment */
  monthlyDetails: SIPMonthlyDetail[];
  
  /** Yearly summary of the investment */
  yearlyBreakdown: SIPYearlyBreakdown[];
}
