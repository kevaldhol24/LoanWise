import { CompoundInterestCalculator } from '../src/core/CompoundInterestCalculator/compoundInterestCalculator';
import { CompoundInterestInputs } from '../src/interfaces/CompoundInterestCalculator/compoundInterestInputs';

const inputs: CompoundInterestInputs = {
  principal: 100000,
  annualRate: 12,
  compoundingFrequency: 1, // Quarterly
  years: 1,
//   additionalContribution: -1000 // Optional, per period
};

const calculator = new CompoundInterestCalculator(inputs);
const result = calculator.calculate();

console.log('Principal:', result.principal);
console.log('Total Amount:', result.totalAmount);
console.log('Total Interest:', result.totalInterest);
console.log('First 5 periods:', result.schedule);
