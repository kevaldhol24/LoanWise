import { BasicLoanInputs } from '../../interfaces/LoanCalculator/inputs';
import { EMIScheduleItem, LoanCalculationOutput, LoanSummary } from '../../interfaces/LoanCalculator/outputs';
import { addMonths, getMonth, getYear } from '../../utils/dateUtils';
import { calculateEMI, calculateMonthlyInterest, roundToDecimal } from '../../utils/financialUtils';

/**
 * Base loan calculator class that handles standard loan calculations
 * with fixed interest rate and no prepayments/EMI changes
 */
export class BaseLoanCalculator {
  protected loanAmount: number;
  protected interestRate: number;
  protected startDate: string;
  protected tenureMonths: number;
  protected calculatedEMI: number;
  
  /**
   * Constructor for BaseLoanCalculator
   * @param inputs Basic loan inputs
   */
  constructor(inputs: BasicLoanInputs) {
    this.validateInputs(inputs);
    
    this.loanAmount = inputs.loanAmount;
    this.interestRate = inputs.initialInterestRate;
    this.startDate = inputs.startDate;
    this.tenureMonths = inputs.tenureMonths;
    
    // Calculate initial EMI based on inputs
    this.calculatedEMI = calculateEMI(this.loanAmount, this.interestRate, this.tenureMonths);
  }
  
  /**
   * Validates the basic loan inputs
   * @param inputs Basic loan inputs to validate
   * @throws Error if inputs are invalid
   */
  protected validateInputs(inputs: BasicLoanInputs): void {
    if (inputs.loanAmount <= 0) {
      throw new Error('Loan amount must be greater than zero');
    }
    
    if (inputs.initialInterestRate < 0) {
      throw new Error('Interest rate cannot be negative');
    }
    
    if (inputs.tenureMonths <= 0 || !Number.isInteger(inputs.tenureMonths)) {
      throw new Error('Tenure must be a positive integer');
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(inputs.startDate)) {
      throw new Error('Start date must be in ISO format (YYYY-MM-DD)');
    }
    
    // Additional date validation
    if (isNaN(Date.parse(inputs.startDate))) {
      throw new Error('Invalid start date');
    }
  }
  
  /**
   * Calculates the loan amortization schedule and summary
   * @returns Loan calculation output with schedule and summary
   */
  public calculate(): LoanCalculationOutput {
    const schedule = this.generateSchedule();
    const summary = this.generateSummary(schedule);
    
    return {
      summary,
      schedule
    };
  }
  
  /**
   * Generates the EMI schedule for the loan
   * @returns Array of EMI schedule items
   */
  protected generateSchedule(): EMIScheduleItem[] {
    let remainingBalance = this.loanAmount;
    let emiNumber = 1;
    const schedule: EMIScheduleItem[] = [];
    let principalPaidTillDate = 0;
    
    for (let i = 0; i < this.tenureMonths; i++) {
      const currentDate = addMonths(this.startDate, i);
      const interestForMonth = calculateMonthlyInterest(remainingBalance, this.interestRate);
      
      // For last EMI, adjust to exactly pay off the loan
      let principalForMonth = this.calculatedEMI - interestForMonth;
      let emiAmount = this.calculatedEMI;
      
      // Final month adjustment
      if (i === this.tenureMonths - 1 || remainingBalance < principalForMonth) {
        principalForMonth = remainingBalance;
        emiAmount = principalForMonth + interestForMonth;
      }
      
      // Update remaining balance
      remainingBalance = roundToDecimal(remainingBalance - principalForMonth, 2);
      
      // Track total principal paid
      principalPaidTillDate = roundToDecimal(principalPaidTillDate + principalForMonth, 2);
      
      // Create schedule item
      const scheduleItem: EMIScheduleItem = {
        emiNumber,
        year: getYear(currentDate),
        month: getMonth(currentDate),
        date: currentDate,
        emiAmount: roundToDecimal(emiAmount, 2),
        interestPaid: roundToDecimal(interestForMonth, 2),
        principalPaid: roundToDecimal(principalForMonth, 2),
        prepayment: 0,
        remainingBalance,
        principalPaidTillDate,
        totalMonthlyPayment: roundToDecimal(emiAmount, 2), // Same as EMI amount when no prepayment
        interestRate: this.interestRate // Add the interest rate for this month
      };
      
      schedule.push(scheduleItem);
      emiNumber++;
      
      // Break if loan is fully paid off
      if (remainingBalance <= 0) {
        break;
      }
    }
    
    return schedule;
  }
  
  /**
   * Generates the loan summary from the schedule
   * @param schedule EMI schedule items
   * @returns Loan summary
   */
  protected generateSummary(schedule: EMIScheduleItem[]): LoanSummary {
    const totalEMIs = schedule.length;
    const lastPayment = schedule[schedule.length - 1];
    
    // Calculate total interest and amount payable
    const totalInterestPayable = schedule.reduce(
      (total, item) => total + item.interestPaid,
      0
    );
    
    // Create summary
    const summary: LoanSummary = {
      loanAmount: this.loanAmount,
      emi: roundToDecimal(this.calculatedEMI, 2),
      totalInterestPayable: roundToDecimal(totalInterestPayable, 2),
      totalAmountPayable: roundToDecimal(this.loanAmount + totalInterestPayable, 2),
      lastPaymentDate: lastPayment.date,
      totalEMIs,
      totalPrepayment: 0, // No prepayments in base calculation
      remainingMonths: 0 // Fully paid
    };
    
    return summary;
  }
}