/**
 * Utility functions for financial calculations in loan calculations
 */

/**
 * Calculates the EMI (Equated Monthly Installment)
 * @param principal Principal loan amount
 * @param ratePerAnnum Annual interest rate in percentage (e.g., 8.5 for 8.5%)
 * @param tenureMonths Loan tenure in months
 * @returns Monthly EMI amount
 */
export function calculateEMI(principal: number, ratePerAnnum: number, tenureMonths: number): number {
  // Convert annual interest rate to monthly and decimal
  const monthlyRate = ratePerAnnum / (12 * 100);
  
  // Calculate EMI using formula: P * r * (1+r)^n / ((1+r)^n - 1)
  if (monthlyRate === 0) {
    // For 0% interest rate, simply divide principal by tenure
    return principal / tenureMonths;
  }
  
  const emi = principal * 
    monthlyRate * 
    Math.pow(1 + monthlyRate, tenureMonths) / 
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  return roundToDecimal(emi, 2);
}

/**
 * Calculates the tenure required for a given EMI, principal, and interest rate
 * @param principal Principal loan amount
 * @param ratePerAnnum Annual interest rate in percentage
 * @param emi Monthly EMI amount
 * @returns Loan tenure in months
 */
export function calculateTenure(principal: number, ratePerAnnum: number, emi: number): number {
  // Convert annual interest rate to monthly and decimal
  const monthlyRate = ratePerAnnum / (12 * 100);
  
  // For 0% interest rate or edge cases
  if (monthlyRate === 0 || emi <= 0) {
    return Math.ceil(principal / emi);
  }
  
  // Calculate tenure using formula: log(EMI / (EMI - P * r)) / log(1 + r)
  // Where r is monthly rate, P is principal, EMI is the monthly payment
  const numerator = Math.log(emi / (emi - principal * monthlyRate));
  const denominator = Math.log(1 + monthlyRate);
  
  return Math.round(numerator / denominator);
}

/**
 * Calculates the minimum EMI required to cover at least interest + some principal
 * @param principal Principal loan amount
 * @param ratePerAnnum Annual interest rate in percentage
 * @returns Minimum EMI amount
 */
export function calculateMinimumEMI(principal: number, ratePerAnnum: number): number {
  // Monthly interest + 0.1% of principal as minimum principal payment
  const monthlyRate = ratePerAnnum / (12 * 100);
  const monthlyInterest = principal * monthlyRate;
  const minimumPrincipal = principal * 0.001; // 0.1% of principal
  
  return roundToDecimal(monthlyInterest + minimumPrincipal, 2);
}

/**
 * Calculates the monthly interest amount
 * @param principal Current principal amount
 * @param ratePerAnnum Annual interest rate in percentage
 * @returns Monthly interest amount
 */
export function calculateMonthlyInterest(principal: number, ratePerAnnum: number): number {
  const monthlyRate = ratePerAnnum / (12 * 100);
  return roundToDecimal(principal * monthlyRate, 2);
}

/**
 * Rounds a number to specified decimal places
 * @param value Value to round
 * @param decimals Number of decimal places
 * @returns Rounded value
 */
export function roundToDecimal(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Validates whether an EMI amount is sufficient to cover interest and some principal
 * @param principal Principal loan amount
 * @param ratePerAnnum Annual interest rate in percentage
 * @param emi EMI amount to validate
 * @returns True if EMI is sufficient, false otherwise
 */
export function isEMISufficient(principal: number, ratePerAnnum: number, emi: number): boolean {
  const minimumEMI = calculateMinimumEMI(principal, ratePerAnnum);
  return emi >= minimumEMI;
}