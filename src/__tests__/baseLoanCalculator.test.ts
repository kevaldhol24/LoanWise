import { BaseLoanCalculator } from '../core/baseLoanCalculator';
import { BasicLoanInputs } from '../interfaces/inputs';

describe('BaseLoanCalculator', () => {
  const defaultInputs: BasicLoanInputs = {
    loanAmount: 100000,
    initialInterestRate: 7.5,
    startDate: '2023-01-01',
    tenureMonths: 120
  };

  test('should correctly calculate EMI for a basic loan', () => {
    const calculator = new BaseLoanCalculator(defaultInputs);
    const result = calculator.calculate();
    
    // Expected EMI for 100000, 7.5% interest, 10 years (120 months)
    // Using formula: P * r * (1+r)^n / ((1+r)^n - 1)
    // where r = 7.5/(12*100) = 0.00625
    expect(result.summary.emi).toBeCloseTo(1187.02, 2);
  });

  test('should correctly calculate total interest payable for a basic loan', () => {
    const calculator = new BaseLoanCalculator(defaultInputs);
    const result = calculator.calculate();
    
    // Total interest = Total amount payable - Principal
    expect(result.summary.totalInterestPayable).toBeCloseTo(42442.01, 2);
  });

  test('should generate the correct number of EMIs', () => {
    const calculator = new BaseLoanCalculator(defaultInputs);
    const result = calculator.calculate();
    
    expect(result.schedule.length).toBe(defaultInputs.tenureMonths);
    expect(result.summary.totalEMIs).toBe(defaultInputs.tenureMonths);
  });

  test('should have correct last payment date', () => {
    const calculator = new BaseLoanCalculator(defaultInputs);
    const result = calculator.calculate();
    
    // Last payment date should be 10 years (120 months) after start date
    // The last payment is actually at the end of the 119th month (starting from 0)
    expect(result.summary.lastPaymentDate).toBe('2032-12-01');
  });

  test('should have zero remaining balance after last payment', () => {
    const calculator = new BaseLoanCalculator(defaultInputs);
    const result = calculator.calculate();
    
    const lastScheduleItem = result.schedule[result.schedule.length - 1];
    expect(lastScheduleItem.remainingBalance).toBeCloseTo(0, 2);
  });

  test('should validate inputs and throw error for negative loan amount', () => {
    const invalidInputs = {
      ...defaultInputs,
      loanAmount: -100000
    };
    
    expect(() => new BaseLoanCalculator(invalidInputs)).toThrow('Loan amount must be greater than zero');
  });

  test('should validate inputs and throw error for negative interest rate', () => {
    const invalidInputs = {
      ...defaultInputs,
      initialInterestRate: -7.5
    };
    
    expect(() => new BaseLoanCalculator(invalidInputs)).toThrow('Interest rate cannot be negative');
  });

  test('should validate inputs and throw error for non-integer tenure', () => {
    const invalidInputs = {
      ...defaultInputs,
      tenureMonths: 120.5
    };
    
    expect(() => new BaseLoanCalculator(invalidInputs)).toThrow('Tenure must be a positive integer');
  });

  test('should validate inputs and throw error for invalid start date format', () => {
    const invalidInputs = {
      ...defaultInputs,
      startDate: '01/01/2023'
    };
    
    expect(() => new BaseLoanCalculator(invalidInputs)).toThrow('Start date must be in ISO format');
  });

  test('should handle zero interest rate loan calculation', () => {
    const zeroInterestInputs = {
      ...defaultInputs,
      initialInterestRate: 0
    };
    
    const calculator = new BaseLoanCalculator(zeroInterestInputs);
    const result = calculator.calculate();
    
    // Expected EMI is simply principal / tenure
    expect(result.summary.emi).toBeCloseTo(100000 / 120, 2);
    expect(result.summary.totalInterestPayable).toBeCloseTo(0, 2);
  });
});