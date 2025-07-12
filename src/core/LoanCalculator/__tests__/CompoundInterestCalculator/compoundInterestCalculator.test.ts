import { CompoundInterestCalculator } from '../../CompoundInterestCalculator/compoundInterestCalculator';

describe('CompoundInterestCalculator', () => {
  it('calculates compound interest with no additional contribution', () => {
    const inputs = {
      principal: 10000,
      annualRate: 8,
      compoundingFrequency: 12,
      years: 5
    };
    const calculator = new CompoundInterestCalculator(inputs);
    const result = calculator.calculate();
    expect(result.principal).toBe(10000);
    expect(result.totalAmount).toBeGreaterThan(10000);
    expect(result.totalInterest).toBeCloseTo(result.totalAmount - 10000, 2);
    expect(result.schedule.length).toBe(60);
  });

  it('calculates compound interest with monthly contributions', () => {
    const inputs = {
      principal: 5000,
      annualRate: 7.5,
      compoundingFrequency: 12,
      years: 3,
      additionalContribution: 100
    };
    const calculator = new CompoundInterestCalculator(inputs);
    const result = calculator.calculate();
    expect(result.principal).toBe(5000);
    expect(result.totalAmount).toBeGreaterThan(5000 + 100 * 36);
    expect(result.schedule.length).toBe(36);
  });

  it('throws error for invalid inputs', () => {
    expect(() => new CompoundInterestCalculator({ principal: -1, annualRate: 8, compoundingFrequency: 12, years: 5 })).toThrow();
    expect(() => new CompoundInterestCalculator({ principal: 1000, annualRate: -1, compoundingFrequency: 12, years: 5 })).toThrow();
    expect(() => new CompoundInterestCalculator({ principal: 1000, annualRate: 8, compoundingFrequency: 0, years: 5 })).toThrow();
    expect(() => new CompoundInterestCalculator({ principal: 1000, annualRate: 8, compoundingFrequency: 12, years: 0 })).toThrow();
    expect(() => new CompoundInterestCalculator({ principal: 1000, annualRate: 8, compoundingFrequency: 12, years: 5, additionalContribution: -10 })).toThrow();
  });
});
