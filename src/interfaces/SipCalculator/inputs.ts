/**
 * SIP pause types
 */
export enum SIPPauseType {
  ONETIME = "onetime",
  MONTHLY = "monthly"
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

  /** Optional: Step-up date (ISO format) if not provided step up should be every year e.g if SIP started on June 2025 then step up applied from July 2026 installment */
  stepUpDate?: string;
  
  /** Optional: Annual inflation rate (%) */
  inflationRate?: number;

  /** Optional: Start date of the investment in ISO format */
  startDate: string;

  /** Pause installments */
  pauseInstallment: SIPPauseInstallment[];

  /** Installment changes */
  installmentChange: InstallmentChange[];
}

/**
 * SIP pause installment details
 */
export interface SIPPauseInstallment {
  /** Start date (ISO format) */
  start: string;

  /** Type of pause (one-time or monthly) */
  type: SIPPauseType;

  /** End date (ISO format) */
  end?: string;
}

export interface InstallmentChange {
  /** Effective date (ISO format) */
  effectiveDate: string;

  /** New installment amount */
  newAmount: number;

  /** New step-up rate */
  newStepUpRate?: number;
}