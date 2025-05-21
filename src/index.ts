// Export interfaces
export * from './interfaces/LoanCalculator/inputs';
export * from './interfaces/LoanCalculator/outputs';

// Export utility functions
export * from './utils/dateUtils';
export * from './utils/financialUtils';

// Export core calculator classes
export * from './core/LoanCalculator/baseLoanCalculator';
export * from './core/LoanCalculator/advancedLoanCalculator';

/**
 * LoanWise - A TypeScript library for detailed loan calculations
 * 
 * This library provides tools to calculate loan schedules with support for:
 * - Fixed and floating interest rates
 * - Prepayments (one-time and monthly)
 * - EMI changes
 * - Detailed amortization schedules and summaries
 * 
 * @example
 * ```typescript
 * import { AdvancedLoanCalculator, LoanCalculationInputs } from 'loanwise';
 * 
 * const loanInputs: LoanCalculationInputs = {
 *   loanAmount: 100000,
 *   initialInterestRate: 7.5,
 *   startDate: '2023-01-01',
 *   tenureMonths: 120,
 *   prepayments: [
 *     {
 *       id: 'prep1',
 *       amount: 10000,
 *       type: 'onetime',
 *       startDate: '2023-06-01',
 *       impact: 'tenure'
 *     }
 *   ]
 * };
 * 
 * const calculator = new AdvancedLoanCalculator(loanInputs);
 * const result = calculator.calculate();
 * console.log(result.summary);
 * console.log(result.schedule);
 * ```
 */