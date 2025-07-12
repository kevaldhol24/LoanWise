import { GoalBasedSIPCalculator } from '../../GoalBasedSIPCalculator/goalBasedSIPCalculator';

describe('GoalBasedSIPCalculator', () => {
  it('calculates SIP for a goal with default monthly compounding', () => {
    const inputs = {
      goalAmount: 1000000,
      years: 10,
      annualRate: 12
    };
    const calculator = new GoalBasedSIPCalculator(inputs);
    const result = calculator.calculate();
    expect(result.goalAmount).toBe(1000000);
    expect(result.years).toBe(10);
    expect(result.annualRate).toBe(12);
    expect(result.monthlyInvestment).toBeGreaterThan(0);
    expect(result.totalInvestment).toBeGreaterThan(0);
  });

  it('calculates SIP for a goal with quarterly compounding', () => {
    const inputs = {
      goalAmount: 500000,
      years: 5,
      annualRate: 10,
      compoundingFrequency: 4
    };
    const calculator = new GoalBasedSIPCalculator(inputs);
    const result = calculator.calculate();
    expect(result.goalAmount).toBe(500000);
    expect(result.years).toBe(5);
    expect(result.annualRate).toBe(10);
    expect(result.compoundingFrequency).toBe(4);
    expect(result.monthlyInvestment).toBeGreaterThan(0);
    expect(result.totalInvestment).toBeGreaterThan(0);
  });

  it('throws error for invalid inputs', () => {
    expect(() => new GoalBasedSIPCalculator({ goalAmount: -1, years: 10, annualRate: 12 })).toThrow();
    expect(() => new GoalBasedSIPCalculator({ goalAmount: 100000, years: 0, annualRate: 12 })).toThrow();
    expect(() => new GoalBasedSIPCalculator({ goalAmount: 100000, years: 10, annualRate: -1 })).toThrow();
    expect(() => new GoalBasedSIPCalculator({ goalAmount: 100000, years: 10, annualRate: 12, compoundingFrequency: 0 })).toThrow();
  });
});
