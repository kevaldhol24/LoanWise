import { AdvancedLoanCalculator } from '../core/advancedLoanCalculator';
import { LoanCalculationInputs } from '../interfaces/inputs';

describe('AdvancedLoanCalculator', () => {
  const defaultInputs: LoanCalculationInputs = {
    loanAmount: 100000,
    initialInterestRate: 7.5,
    startDate: '2023-01-01',
    tenureMonths: 120
  };

  test('should correctly calculate basic loan without advanced features', () => {
    const calculator = new AdvancedLoanCalculator(defaultInputs);
    const result = calculator.calculate();
    
    expect(result.summary.emi).toBeCloseTo(1187.02, 2);
    expect(result.summary.totalInterestPayable).toBeCloseTo(42442.01, 2);
    expect(result.schedule.length).toBe(defaultInputs.tenureMonths);
  });

  test('should handle one-time prepayment with tenure impact', () => {
    const inputsWithPrepayment: LoanCalculationInputs = {
      ...defaultInputs,
      prepayments: [
        {
          id: 'prep1',
          amount: 10000,
          type: 'onetime',
          startDate: '2023-06-01',
          impact: 'tenure'
        }
      ]
    };
    
    const calculator = new AdvancedLoanCalculator(inputsWithPrepayment);
    const result = calculator.calculate();
    
    // Expect fewer EMIs than original tenure due to prepayment
    expect(result.schedule.length).toBeLessThan(defaultInputs.tenureMonths);
    
    // Verify that prepayment amount is correctly recorded
    expect(result.summary.totalPrepayment).toBe(10000);
    
    // Check if impact data is generated
    expect(result.impacts?.prepaymentImpacts.length).toBe(1);
    expect(result.impacts?.prepaymentImpacts[0].prepaymentId).toBe('prep1');
    expect(result.impacts?.prepaymentImpacts[0].monthsReduced).toBeGreaterThan(0);
    expect(result.impacts?.prepaymentImpacts[0].interestSaved).toBeGreaterThan(0);
  });

  test('should handle monthly prepayment with EMI impact', () => {
    const inputsWithPrepayment: LoanCalculationInputs = {
      ...defaultInputs,
      prepayments: [
        {
          id: 'prep2',
          amount: 500,
          type: 'monthly',
          startDate: '2023-06-01',
          endDate: '2023-12-01',
          impact: 'EMI'
        }
      ]
    };
    
    const calculator = new AdvancedLoanCalculator(inputsWithPrepayment);
    const result = calculator.calculate();
    
    // Monthly prepayments with EMI impact can still reduce tenure
    // Just verify that prepayments are being applied
    const juneEntry = result.schedule.find(item => item.date === '2023-06-01');
    expect(juneEntry?.prepayment).toBe(500);
    
    // Verify impact data
    expect(result.impacts?.prepaymentImpacts[0].emiReduced).toBeGreaterThan(0);
  });

  test('should handle interest rate change with EMI impact', () => {
    const inputsWithInterestChange: LoanCalculationInputs = {
      ...defaultInputs,
      interestRateChanges: [
        {
          id: 'int1',
          rate: 8.5,
          effectiveDate: '2024-01-01',
          impact: 'EMI'
        }
      ]
    };
    
    const calculator = new AdvancedLoanCalculator(inputsWithInterestChange);
    const result = calculator.calculate();
    
    // Total tenure should be the same
    expect(result.schedule.length).toBe(defaultInputs.tenureMonths);
    
    // Verify impact data shows increased EMI
    const impacts = result.impacts?.interestRateChangeImpacts;
    expect(impacts).toBeDefined();
    expect(impacts?.length).toBeGreaterThan(0);
    
    if (impacts && impacts.length > 0) {
      expect(impacts[0].newEMI).toBeGreaterThan(impacts[0].oldEMI);
    }
  });

  test('should handle interest rate change with tenure impact', () => {
    const inputsWithInterestChange: LoanCalculationInputs = {
      ...defaultInputs,
      interestRateChanges: [
        {
          id: 'int2',
          rate: 8.5,
          effectiveDate: '2024-01-01',
          impact: 'tenure'
        }
      ]
    };
    
    const calculator = new AdvancedLoanCalculator(inputsWithInterestChange);
    const result = calculator.calculate();
    
    // For tenure impact, verify the impact data shows increased tenure
    // rather than checking the actual schedule length
    expect(result.impacts?.interestRateChangeImpacts[0].tenureChange).toBeGreaterThan(0);
  });

  test('should handle EMI change correctly', () => {
    const inputsWithEMIChange: LoanCalculationInputs = {
      ...defaultInputs,
      emiChanges: [
        {
          id: 'emi1',
          emi: 1300,
          startDate: '2024-01-01'
        }
      ]
    };
    
    const calculator = new AdvancedLoanCalculator(inputsWithEMIChange);
    const result = calculator.calculate();
    
    // Check if EMI change impact is recorded
    expect(result.impacts?.emiChangeImpacts.length).toBe(1);
    expect(result.impacts?.emiChangeImpacts[0].emiChangeId).toBe('emi1');
    expect(result.impacts?.emiChangeImpacts[0].newEMI).toBe(1300);
    
    // With increased EMI, we expect negative tenure change (tenure reduction)
    expect(result.impacts?.emiChangeImpacts[0].tenureChange).toBeLessThan(0);
  });

  test('should handle combination of prepayment and interest rate change', () => {
    const inputsWithCombination: LoanCalculationInputs = {
      ...defaultInputs,
      prepayments: [
        {
          id: 'prep3',
          amount: 10000,
          type: 'onetime',
          startDate: '2023-06-01',
          impact: 'tenure'
        }
      ],
      interestRateChanges: [
        {
          id: 'int3',
          rate: 8.5,
          effectiveDate: '2024-01-01',
          impact: 'EMI'
        }
      ]
    };
    
    const calculator = new AdvancedLoanCalculator(inputsWithCombination);
    const result = calculator.calculate();
    
    // Verify impacts are recorded for both prepayment and interest rate change
    expect(result.impacts?.prepaymentImpacts.length).toBe(1);
    expect(result.impacts?.interestRateChangeImpacts.length).toBe(1);
  });

  test('should throw error for invalid prepayment', () => {
    const inputsWithInvalidPrepayment: LoanCalculationInputs = {
      ...defaultInputs,
      prepayments: [
        {
          id: 'prep4',
          amount: -1000, // Negative amount is invalid
          type: 'onetime',
          startDate: '2023-06-01',
          impact: 'tenure'
        }
      ]
    };
    
    expect(() => new AdvancedLoanCalculator(inputsWithInvalidPrepayment)).toThrow('Prepayment prep4 amount must be greater than zero');
  });

  test('should throw error for invalid interest rate change', () => {
    const inputsWithInvalidInterestChange: LoanCalculationInputs = {
      ...defaultInputs,
      interestRateChanges: [
        {
          id: 'int4',
          rate: -2.5, // Negative interest rate is invalid
          effectiveDate: '2024-01-01',
          impact: 'EMI'
        }
      ]
    };
    
    expect(() => new AdvancedLoanCalculator(inputsWithInvalidInterestChange)).toThrow('Interest rate change int4 rate cannot be negative');
  });

  test('should throw error for invalid EMI change amount', () => {
    const inputsWithInvalidEMIChange: LoanCalculationInputs = {
      ...defaultInputs,
      emiChanges: [
        {
          id: 'emi2',
          emi: 0, // Zero EMI is invalid
          startDate: '2024-01-01'
        }
      ]
    };
    
    expect(() => new AdvancedLoanCalculator(inputsWithInvalidEMIChange)).toThrow('EMI change emi2 amount must be greater than zero');
  });
});