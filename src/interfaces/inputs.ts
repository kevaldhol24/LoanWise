/**
 * Basic loan inputs interface
 */
export interface BasicLoanInputs {
  /** Total loan principal amount */
  loanAmount: number;
  
  /** Interest rate at the start of the loan (annual percentage) */
  initialInterestRate: number;
  
  /** Loan start date in ISO format */
  startDate: string;
  
  /** Number of months for repayment */
  tenureMonths: number;
}

/**
 * Defines the impact type of a change (prepayment, interest rate change, etc.)
 */
export enum ImpactType {
  EMI = 'EMI',
  Tenure = 'tenure',
}

export enum PrepaymentFrequency {
  Monthly = 'monthly',
  Onetime = 'onetime',
}
/**
 * Base change interface with common properties
 */
interface BaseChange {
  /** Unique identifier for the change */
  id: string;
}

/**
 * Prepayment definition interface
 */
export interface Prepayment extends BaseChange {
  /** Prepayment amount */
  amount: number;
  
  /** Type of prepayment */
  type: PrepaymentFrequency;
  
  /** Date of first/only prepayment in ISO format */
  startDate: string;
  
  /** Optional end date in ISO format (defaults to loan end) */
  endDate?: string;
  
  /** Impact type of prepayment */
  impact: ImpactType;
}

/**
 * Interest rate change definition interface
 */
export interface InterestRateChange extends BaseChange {
  /** New interest rate (annual percentage) */
  rate: number;
  
  /** Date when the rate change takes effect in ISO format */
  effectiveDate: string;
  
  /** Impact type of interest rate change */
  impact: ImpactType;
}

/**
 * EMI change definition interface
 */
export interface EMIChange extends BaseChange {
  /** New EMI amount */
  emi: number;
  
  /** Date from which new EMI applies in ISO format */
  startDate: string;
}

/**
 * Complete loan calculation inputs interface
 */
export interface LoanCalculationInputs extends BasicLoanInputs {
  /** Array of prepayments */
  prepayments?: Prepayment[];
  
  /** Array of interest rate changes */
  interestRateChanges?: InterestRateChange[];
  
  /** Array of EMI changes */
  emiChanges?: EMIChange[];
}