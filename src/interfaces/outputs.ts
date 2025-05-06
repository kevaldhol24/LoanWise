/**
 * Loan summary output interface
 */
export interface LoanSummary {
  /** Total loan principal amount */
  loanAmount: number;
  
  /** Equated Monthly Installment amount */
  emi: number;
  
  /** Total interest payable over the loan term */
  totalInterestPayable: number;
  
  /** Total amount payable (principal + interest) */
  totalAmountPayable: number;
  
  /** Last payment date in ISO format */
  lastPaymentDate: string;
  
  /** Total number of EMIs */
  totalEMIs: number;
  
  /** Total prepayment amount (if any) */
  totalPrepayment: number;
  
  /** Remaining months until loan completion */
  remainingMonths: number;
}

/**
 * EMI schedule item interface
 */
export interface EMIScheduleItem {
  /** EMI count (sequential number) */
  emiNumber: number;
  
  /** Year of the EMI payment */
  year: number;
  
  /** Month of the EMI payment */
  month: number;
  
  /** EMI date in ISO format */
  date: string;
  
  /** EMI amount for this period */
  emiAmount: number;
  
  /** Interest portion of the EMI */
  interestPaid: number;
  
  /** Principal portion of the EMI */
  principalPaid: number;
  
  /** Prepayment amount (if any) */
  prepayment: number;
  
  /** Remaining balance after this payment */
  remainingBalance: number;
  
  /** Principal paid until this payment */
  principalPaidTillDate: number;
  
  /** Total monthly payment (EMI + prepayment) */
  totalMonthlyPayment: number;
  
  /** Interest rate applied for this month (annual percentage) */
  interestRate: number;
}

/**
 * Impact summary for a prepayment
 */
export interface PrepaymentImpact {
  /** ID of the prepayment */
  prepaymentId: string;
  
  /** Total prepaid amount */
  totalPrepaymentAmount: number;
  
  /** Interest amount saved from prepayment */
  interestSaved: number;
  
  /** Number of months reduced if impact is on tenure */
  monthsReduced: number;
  
  /** EMI reduced if impact is on EMI */
  emiReduced: number;
}

/**
 * Impact summary for an interest rate change
 */
export interface InterestRateChangeImpact {
  /** ID of the interest rate change */
  interestChangeId: string;
  
  /** Old interest rate */
  oldRate: number;
  
  /** New interest rate */
  newRate: number;
  
  /** EMI before change */
  oldEMI: number;
  
  /** EMI after change if impact is on EMI */
  newEMI: number;
  
  /** Number of months added/reduced if impact is on tenure */
  tenureChange: number;
  
  /** Change in total interest paid */
  interestDifference: number;
}

/**
 * Impact summary for an EMI change
 */
export interface EMIChangeImpact {
  /** ID of the EMI change */
  emiChangeId: string;
  
  /** Old EMI amount */
  oldEMI: number;
  
  /** New EMI amount */
  newEMI: number;
  
  /** Number of months added/reduced due to EMI change */
  tenureChange: number;
  
  /** Change in total interest paid */
  interestDifference: number;
}

/**
 * Combined impact summary
 */
export interface ImpactSummary {
  /** Impacts from prepayments */
  prepaymentImpacts: PrepaymentImpact[];
  
  /** Impacts from interest rate changes */
  interestRateChangeImpacts: InterestRateChangeImpact[];
  
  /** Impacts from EMI changes */
  emiChangeImpacts: EMIChangeImpact[];
}

/**
 * Complete loan calculation output interface
 */
export interface LoanCalculationOutput {
  /** Summary of the loan */
  summary: LoanSummary;
  
  /** Detailed EMI schedule */
  schedule: EMIScheduleItem[];
  
  /** Summary of impacts from changes */
  impacts?: ImpactSummary;
}