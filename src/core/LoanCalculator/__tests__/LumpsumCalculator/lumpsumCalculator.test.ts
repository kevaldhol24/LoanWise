import { LumpsumCalculator } from '../../LumpsumCalculator/lumpsumCalculator';

describe('LumpsumCalculator', () => {
  it('calculates lumpsum investment with yearly compounding', () => {
    const inputs = {
      principal: 10000,
      annualRate: 8,
      years: 5
    };
    const calculator = new LumpsumCalculator(inputs);
    const result = calculator.calculate();
    expect(result.principal).toBe(10000);
    expect(result.totalAmount).toBeGreaterThan(10000);
    expect(result.totalInterest).toBeCloseTo(result.totalAmount - 10000, 2);
  });

  it('calculates lumpsum investment with monthly compounding', () => {
    const inputs = {
      principal: 5000,
      annualRate: 7.5,
      years: 3,
      compoundingFrequency: 12
    };
    const calculator = new LumpsumCalculator(inputs);
    const result = calculator.calculate();
    expect(result.principal).toBe(5000);
    expect(result.totalAmount).toBeGreaterThan(5000);
    expect(result.totalInterest).toBeCloseTo(result.totalAmount - 5000, 2);
  });

  it('throws error for invalid inputs', () => {
    expect(() => new LumpsumCalculator({ principal: -1, annualRate: 8, years: 5 })).toThrow();
    expect(() => new LumpsumCalculator({ principal: 1000, annualRate: -1, years: 5 })).toThrow();
    expect(() => new LumpsumCalculator({ principal: 1000, annualRate: 8, years: 0 })).toThrow();
    expect(() => new LumpsumCalculator({ principal: 1000, annualRate: 8, years: 5, compoundingFrequency: 0 })).toThrow();
  });
});
