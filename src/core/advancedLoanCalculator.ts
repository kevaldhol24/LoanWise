import { EMIChange, InterestRateChange, LoanCalculationInputs, Prepayment } from '../interfaces/inputs';
import { 
  EMIChangeImpact, 
  EMIScheduleItem, 
  ImpactSummary, 
  InterestRateChangeImpact, 
  LoanCalculationOutput, 
  LoanSummary,
  PrepaymentImpact 
} from '../interfaces/outputs';
import { addMonths, getMonth, getYear, isBefore, isBetween } from '../utils/dateUtils';
import { calculateEMI, calculateMinimumEMI, calculateMonthlyInterest, calculateTenure, isEMISufficient, roundToDecimal } from '../utils/financialUtils';
import { BaseLoanCalculator } from './baseLoanCalculator';

/**
 * Advanced loan calculator that handles prepayments, interest rate changes, and EMI changes
 */
export class AdvancedLoanCalculator extends BaseLoanCalculator {
  private prepayments: Prepayment[] = [];
  private interestRateChanges: InterestRateChange[] = [];
  private emiChanges: EMIChange[] = [];
  private prepaymentImpacts: PrepaymentImpact[] = [];
  private interestChangeImpacts: InterestRateChangeImpact[] = [];
  private emiChangeImpacts: EMIChangeImpact[] = [];
  private emiSchedule: EMIScheduleItem[] = [];
  
  /**
   * Constructor for AdvancedLoanCalculator
   * @param inputs Loan calculation inputs including prepayments, interest changes, and EMI changes
   */
  constructor(inputs: LoanCalculationInputs) {
    super(inputs);
    
    // Store additional inputs
    this.prepayments = inputs.prepayments || [];
    this.interestRateChanges = inputs.interestRateChanges || [];
    this.emiChanges = inputs.emiChanges || [];
    
    // Validate additional inputs
    this.validatePrepayments();
    this.validateInterestRateChanges();
    this.validateEMIChanges();
  }
  
  /**
   * Validates prepayment inputs
   * @throws Error if any prepayment is invalid
   */
  private validatePrepayments(): void {
    for (const prepayment of this.prepayments) {
      if (prepayment.amount <= 0) {
        throw new Error(`Prepayment ${prepayment.id} amount must be greater than zero`);
      }
      
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(prepayment.startDate)) {
        throw new Error(`Prepayment ${prepayment.id} start date must be in ISO format (YYYY-MM-DD)`);
      }
      
      if (prepayment.endDate && !dateRegex.test(prepayment.endDate)) {
        throw new Error(`Prepayment ${prepayment.id} end date must be in ISO format (YYYY-MM-DD)`);
      }
      
      // Check if start date is before end date if end date is provided
      if (prepayment.endDate && isBefore(prepayment.endDate, prepayment.startDate)) {
        throw new Error(`Prepayment ${prepayment.id} end date cannot be before start date`);
      }
      
      // Check if start date is not before loan start date
      if (isBefore(prepayment.startDate, this.startDate)) {
        throw new Error(`Prepayment ${prepayment.id} start date cannot be before loan start date`);
      }
      
      // Check if impact is valid
      if (prepayment.impact !== 'EMI' && prepayment.impact !== 'tenure') {
        throw new Error(`Prepayment ${prepayment.id} impact must be either 'EMI' or 'tenure'`);
      }
      
      // Check if type is valid
      if (prepayment.type !== 'monthly' && prepayment.type !== 'onetime') {
        throw new Error(`Prepayment ${prepayment.id} type must be either 'monthly' or 'onetime'`);
      }
    }
  }
  
  /**
   * Validates interest rate change inputs
   * @throws Error if any interest rate change is invalid
   */
  private validateInterestRateChanges(): void {
    for (const interestChange of this.interestRateChanges) {
      if (interestChange.rate < 0) {
        throw new Error(`Interest rate change ${interestChange.id} rate cannot be negative`);
      }
      
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(interestChange.effectiveDate)) {
        throw new Error(`Interest rate change ${interestChange.id} effective date must be in ISO format (YYYY-MM-DD)`);
      }
      
      // Check if effective date is not before loan start date
      if (isBefore(interestChange.effectiveDate, this.startDate)) {
        throw new Error(`Interest rate change ${interestChange.id} effective date cannot be before loan start date`);
      }
      
      // Check if impact is valid
      if (interestChange.impact !== 'EMI' && interestChange.impact !== 'tenure') {
        throw new Error(`Interest rate change ${interestChange.id} impact must be either 'EMI' or 'tenure'`);
      }
    }
  }
  
  /**
   * Validates EMI change inputs
   * @throws Error if any EMI change is invalid
   */
  private validateEMIChanges(): void {
    for (const emiChange of this.emiChanges) {
      if (emiChange.emi <= 0) {
        throw new Error(`EMI change ${emiChange.id} amount must be greater than zero`);
      }
      
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(emiChange.startDate)) {
        throw new Error(`EMI change ${emiChange.id} start date must be in ISO format (YYYY-MM-DD)`);
      }
      
      // Check if start date is not before loan start date
      if (isBefore(emiChange.startDate, this.startDate)) {
        throw new Error(`EMI change ${emiChange.id} start date cannot be before loan start date`);
      }
    }
  }
  
  /**
   * Calculates the loan amortization schedule and summary with all advanced features
   * @returns Loan calculation output with schedule, summary, and impacts
   */
  public calculate(): LoanCalculationOutput {
    const schedule = this.generateSchedule();
    const summary = this.generateSummary(schedule);
    
    // Generate impact summaries
    const impacts: ImpactSummary = {
      prepaymentImpacts: this.prepaymentImpacts,
      interestRateChangeImpacts: this.interestChangeImpacts,
      emiChangeImpacts: this.emiChangeImpacts
    };
    
    return {
      summary,
      schedule,
      impacts
    };
  }

  /**
   * Gets the minimum EMI for a specific month
   * @param date Date in ISO format (YYYY-MM-DD)
   * @returns Minimum EMI for the month
   */
  public getMinimumEMIForMonth(date: string): number {
    const parsedDate = new Date(date);
    const emi = this.emiSchedule.find(item => item.month === parsedDate.getMonth() && item.year === parsedDate.getFullYear());
    if (!emi) {
      return 0;
    }
    return calculateMinimumEMI(emi.remainingBalance, emi.interestRate);
  }

  /**
   * Generates the EMI schedule for the loan with all advanced features
   * @returns Array of EMI schedule items
   */
  protected generateSchedule(): EMIScheduleItem[] {
    let remainingBalance = this.loanAmount;
    let emiNumber = 1;
    const schedule: EMIScheduleItem[] = [];
    let principalPaidTillDate = 0;
    let currentEMI = this.calculatedEMI;
    let currentInterestRate = this.interestRate;
    let totalPrepayment = 0;
    
    // Create a loan end date calculation (maximum possible duration)
    const maxTenure = this.tenureMonths * 3; // Allow a buffer for potential tenure extensions
    
    // Process through each month until loan is fully paid or max tenure is reached
    for (let i = 0; i < maxTenure; i++) {
      const currentDate = addMonths(this.startDate, i);
      
      // Apply changes for the current month in REVERSED order of precedence:
      // 1. Interest rate changes first
      // 2. Then EMI changes (so they take precedence)
      // 3. Prepayments
      
      // First check if there's an interest rate change for the current month
      const {
        currentEMI: updatedEMI,
        currentInterestRate: updatedInterestRate
      } = this.applyInterestRateChange(currentDate, currentEMI, remainingBalance, currentInterestRate);
      currentEMI = updatedEMI;
      currentInterestRate = updatedInterestRate;

      // Check if there's an EMI change for the current month
      currentEMI = this.applyEMIChange(currentDate, currentEMI, remainingBalance, currentInterestRate);
      
      // Calculate interest for the current month based on current interest rate
      const interestForMonth = calculateMonthlyInterest(remainingBalance, currentInterestRate);
      
      // Calculate principal component of EMI
      let principalForMonth = currentEMI - interestForMonth;
      let emiAmount = currentEMI;
      
      // Check if the remaining balance is less than the principal component
      if (remainingBalance < principalForMonth) {
        principalForMonth = remainingBalance;
        emiAmount = principalForMonth + interestForMonth;
      }
      
      // Update remaining balance after EMI
      remainingBalance = roundToDecimal(remainingBalance - principalForMonth, 2);
      
      // Calculate prepayment for the current month
      const { totalPrepayment: prepaymentAmount, newEMI } = this.calculatePrepaymentForMonth(currentDate, remainingBalance, currentInterestRate, emiAmount);
      currentEMI = newEMI;
      // Apply prepayment if any
      if (prepaymentAmount > 0) {
        // If prepayment is greater than remaining balance, adjust it
        const actualPrepayment = Math.min(prepaymentAmount, remainingBalance);
        remainingBalance = roundToDecimal(remainingBalance - actualPrepayment, 2);
        totalPrepayment += actualPrepayment;
      }
      
      // Update total principal paid
      principalPaidTillDate = roundToDecimal(principalPaidTillDate + principalForMonth + (prepaymentAmount || 0), 2);
      
      // Create schedule item
      const scheduleItem: EMIScheduleItem = {
        emiNumber,
        year: getYear(currentDate),
        month: getMonth(currentDate),
        date: currentDate,
        emiAmount: roundToDecimal(emiAmount, 2),
        interestPaid: roundToDecimal(interestForMonth, 2),
        principalPaid: roundToDecimal(principalForMonth, 2),
        prepayment: roundToDecimal(prepaymentAmount || 0, 2),
        remainingBalance,
        principalPaidTillDate,
        totalMonthlyPayment: roundToDecimal(emiAmount + (prepaymentAmount || 0), 2),
        interestRate: currentInterestRate // Add the interest rate for this month
      };
      
      schedule.push(scheduleItem);
      emiNumber++;
      
      // Break if loan is fully paid off
      if (remainingBalance <= 0) {
        break;
      }
      
      // Break if max tenure is reached (safety check)
      if (i >= maxTenure - 1) {
        break;
      }
    }
    this.emiSchedule = schedule;
    return schedule;
  }
  
  /**
   * Applies EMI changes for the current month
   * @param currentDate Current date
   * @param currentEMI Reference to the current EMI amount
   * @param remainingBalance Current remaining balance
   * @param currentInterestRate Current interest rate
   */
  private applyEMIChange(currentDate: string, currentEMIAmount: number, remainingBalance: number, currentInterestRate: number): number {
    const applicableEMIChanges = this.emiChanges.filter(
      change => currentDate === change.startDate
    );

    let currentEMI = currentEMIAmount;
    
    if (applicableEMIChanges.length > 0) {
      // Sort by date to get the latest change
      applicableEMIChanges.sort((a, b) => 
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      
      const emiChange = applicableEMIChanges[0];
      const oldEMI = currentEMI;
      
      // Check if new EMI is sufficient to cover interest and some principal
      if (!isEMISufficient(remainingBalance, currentInterestRate, emiChange.emi)) {
        throw new Error(`EMI change ${emiChange.id} amount is insufficient to cover interest and principal payments`);
      }
      
      // Apply the EMI change
      currentEMI = emiChange.emi;
      
      // Calculate impact
      const oldTenure = calculateTenure(remainingBalance, currentInterestRate, oldEMI);
      const newTenure = calculateTenure(remainingBalance, currentInterestRate, emiChange.emi);
      const tenureChange = newTenure - oldTenure;
      
      // Calculate interest difference using accurate method
      const oldTotalInterest = this.calculateAccurateInterest(remainingBalance, currentInterestRate, oldEMI);
      const newTotalInterest = this.calculateAccurateInterest(remainingBalance, currentInterestRate, emiChange.emi);
      const interestDifference = newTotalInterest - oldTotalInterest;
      
      // Store the impact
      this.emiChangeImpacts.push({
        emiChangeId: emiChange.id,
        oldEMI,
        newEMI: emiChange.emi,
        tenureChange,
        interestDifference: roundToDecimal(interestDifference, 2)
      });
    }
    return currentEMI;
  }
  
  /**
   * Applies interest rate changes for the current month
   * @param currentDate Current date
   * @param currentEMI Reference to the current EMI amount
   * @param remainingBalance Current remaining balance
   * @param currentInterestRate Reference to the current interest rate
   */
  private applyInterestRateChange(currentDate: string, currentEMIAmount: number, remainingBalance: number, currentLoanInterestRate: number): {
    currentEMI: number;
    currentInterestRate: number;
  } {
    const applicableRateChanges = this.interestRateChanges.filter(
      change => currentDate === change.effectiveDate
    );

    let currentInterestRate = currentLoanInterestRate;
    let currentEMI = currentEMIAmount;
    
    if (applicableRateChanges.length > 0) {
      // Sort by date to get the latest change
      applicableRateChanges.sort((a, b) => 
        new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
      );
      
      const rateChange = applicableRateChanges[0];
      const oldRate = currentInterestRate;
      const oldEMI = currentEMI;
      
      // Apply the interest rate change
      currentInterestRate = rateChange.rate;
      
      // If the impact is on EMI, recalculate the EMI
      if (rateChange.impact === 'EMI') {
        const oldTenure = calculateTenure(remainingBalance, oldRate, oldEMI);
        const newEMI = calculateEMI(remainingBalance, rateChange.rate, oldTenure);
        currentEMI = newEMI;
        
        // Calculate interest difference using accurate method
        const oldTotalInterest = this.calculateAccurateInterest(remainingBalance, oldRate, oldEMI);
        const newTotalInterest = this.calculateAccurateInterest(remainingBalance, rateChange.rate, newEMI);
        const interestDifference = newTotalInterest - oldTotalInterest;
        
        // Store the impact
        this.interestChangeImpacts.push({
          interestChangeId: rateChange.id,
          oldRate,
          newRate: rateChange.rate,
          oldEMI,
          newEMI,
          tenureChange: 0, // No change in tenure
          interestDifference: roundToDecimal(interestDifference, 2)
        });
      } else {
        // If the impact is on tenure, keep the EMI the same
        const oldTenure = calculateTenure(remainingBalance, oldRate, oldEMI);
        const newTenure = calculateTenure(remainingBalance, rateChange.rate, oldEMI);
        const tenureChange = newTenure - oldTenure;
        
        // Calculate interest difference using accurate method
        const oldTotalInterest = this.calculateAccurateInterest(remainingBalance, oldRate, oldEMI);
        const newTotalInterest = this.calculateAccurateInterest(remainingBalance, rateChange.rate, oldEMI);
        const interestDifference = newTotalInterest - oldTotalInterest;
        
        // Store the impact
        this.interestChangeImpacts.push({
          interestChangeId: rateChange.id,
          oldRate,
          newRate: rateChange.rate,
          oldEMI,
          newEMI: oldEMI, // EMI doesn't change
          tenureChange,
          interestDifference: roundToDecimal(interestDifference, 2)
        });
      }
    }

    return {
      currentEMI,
      currentInterestRate
    };
  }
  
  /**
   * Calculates prepayment amount for the current month
   * @param currentDate Current date
   * @param remainingBalance Current remaining balance
   * @param loanInterestRate Current loan interest rate
   * @param emiAmount Current EMI amount
   * @returns Prepayment amount for the month
   */
  private calculatePrepaymentForMonth(currentDate: string, remainingBalance: number, loanInterestRate: number, emiAmount: number): { totalPrepayment: number; newEMI: number } {
    let totalPrepayment = 0;
    let newEMI = emiAmount;
    // Process all applicable prepayments for the current month
    for (const prepayment of this.prepayments) {
      // Skip if the payment is not applicable for this month
      if (prepayment.type === 'onetime' && prepayment.startDate !== currentDate) {
        continue;
      }
      
      // For monthly prepayments, check if the current date is within the range
      if (prepayment.type === 'monthly') {
        const endDate = prepayment.endDate || addMonths(this.startDate, this.tenureMonths);
        if (!isBetween(currentDate, prepayment.startDate, endDate)) {
          continue;
        }
      }
      
      // Get prepayment amount (ensure it doesn't exceed remaining balance)
      const prepaymentAmount = Math.min(prepayment.amount, remainingBalance);
      totalPrepayment += prepaymentAmount;
      
      // Calculate the impact of this prepayment
      newEMI = this.calculatePrepaymentImpact(prepayment, remainingBalance, prepaymentAmount, loanInterestRate, emiAmount);
    }
    
    return {totalPrepayment, newEMI};
  }
  
  /**
   * Calculates and stores the impact of a prepayment
   * @param prepayment Prepayment definition
   * @param remainingBalance Current remaining balance
   * @param prepaymentAmount Actual prepayment amount
   * @param loanInterestRate Current loan interest rate
   * @param emiAmount Current EMI amount
   */
  private calculatePrepaymentImpact(
    prepayment: Prepayment,
    remainingBalance: number,
    prepaymentAmount: number,
    loanInterestRate: number,
    emiAmount: number,
  ): number {
    // Find existing impact for this prepayment ID
    const existingImpact = this.prepaymentImpacts.find(
      impact => impact.prepaymentId === prepayment.id
    );
    
    // Calculate the interest saved and other impacts
    const currentInterestRate = loanInterestRate;
    let currentEMI = emiAmount;
    
    if (prepayment.impact === 'tenure') {
      // Calculate old tenure and new tenure
      const oldTenure = calculateTenure(remainingBalance, currentInterestRate, currentEMI);
      const newTenure = calculateTenure(
        remainingBalance - prepaymentAmount,
        currentInterestRate,
        currentEMI
      );
      const monthsReduced = oldTenure - newTenure;
      
      // Calculate interest saved using accurate method
      const oldTotalInterest = this.calculateAccurateInterest(remainingBalance, currentInterestRate, currentEMI);
      const newTotalInterest = this.calculateAccurateInterest(
        remainingBalance - prepaymentAmount, 
        currentInterestRate, 
        currentEMI
      );
      const interestSaved = oldTotalInterest - newTotalInterest;
      
      if (existingImpact) {
        // Update existing impact
        existingImpact.totalPrepaymentAmount += prepaymentAmount;
        existingImpact.interestSaved += interestSaved;
        existingImpact.monthsReduced += monthsReduced;
      } else {
        // Create new impact
        this.prepaymentImpacts.push({
          prepaymentId: prepayment.id,
          totalPrepaymentAmount: prepaymentAmount,
          interestSaved: roundToDecimal(interestSaved, 2),
          monthsReduced,
          emiReduced: 0 // No change in EMI
        });
      }
    } else {
      // Impact is on EMI
      // Recalculate EMI based on remaining tenure
      const remainingTenureMonths = calculateTenure(
        remainingBalance,
        currentInterestRate,
        currentEMI
      );
      
      const oldEMI = currentEMI;
      const newEMI = calculateEMI(
        remainingBalance - prepaymentAmount,
        currentInterestRate,
        remainingTenureMonths
      );
      const emiReduced = oldEMI - newEMI;
      
      // Calculate interest saved using accurate method
      const oldTotalInterest = this.calculateAccurateInterest(remainingBalance, currentInterestRate, oldEMI);
      const newTotalInterest = this.calculateAccurateInterest(
        remainingBalance - prepaymentAmount, 
        currentInterestRate, 
        newEMI
      );
      const interestSaved = oldTotalInterest - newTotalInterest;
      
      if (existingImpact) {
        // Update existing impact
        existingImpact.totalPrepaymentAmount += prepaymentAmount;
        existingImpact.interestSaved += interestSaved;
        existingImpact.emiReduced += emiReduced;
      } else {
        // Create new impact
        this.prepaymentImpacts.push({
          prepaymentId: prepayment.id,
          totalPrepaymentAmount: prepaymentAmount,
          interestSaved: roundToDecimal(interestSaved, 2),
          monthsReduced: 0, // No change in tenure
          emiReduced: roundToDecimal(emiReduced, 2)
        });
      }
      currentEMI = newEMI;
    }
    return currentEMI
  }
  
  /**
   * Generates the loan summary from the schedule
   * @param schedule EMI schedule items
   * @returns Loan summary
   */
  protected generateSummary(schedule: EMIScheduleItem[]): LoanSummary {
    const totalEMIs = schedule.length;
    const lastPayment = schedule[totalEMIs - 1];
    
    // Calculate total interest and prepayment
    const totalInterestPayable = schedule.reduce(
      (total, item) => total + item.interestPaid,
      0
    );
    
    const totalPrepayment = schedule.reduce(
      (total, item) => total + item.prepayment,
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
      totalPrepayment: roundToDecimal(totalPrepayment, 2),
      remainingMonths: 0 // Fully paid
    };
    
    return summary;
  }

  /**
   * Calculates the accurate total interest by simulating the actual amortization schedule
   * @param principal Initial loan amount or remaining balance
   * @param interestRate Annual interest rate
   * @param emiAmount Monthly EMI amount
   * @returns The total interest paid over the loan
   */
  private calculateAccurateInterest(principal: number, interestRate: number, emiAmount: number): number {
    let remainingBalance = principal;
    let totalInterest = 0;
    
    // Iterate until loan is fully paid or for a maximum number of iterations
    const maxIterations = 1000; // Safety limit
    
    for (let i = 0; i < maxIterations && remainingBalance > 0; i++) {
      // Calculate interest for the current month
      const interestForMonth = calculateMonthlyInterest(remainingBalance, interestRate);
      
      // Principal component of EMI
      let principalForMonth = emiAmount - interestForMonth;
      
      // Adjust for the last payment if needed
      if (remainingBalance < principalForMonth) {
        principalForMonth = remainingBalance;
      }
      
      // Add interest to the total
      totalInterest += interestForMonth;
      
      // Reduce the remaining balance
      remainingBalance = roundToDecimal(remainingBalance - principalForMonth, 2);
    }
    
    return roundToDecimal(totalInterest, 2);
  }
}