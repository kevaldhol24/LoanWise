import { CompoundInterestCalculator } from '../src/core/LoanCalculator/CompoundInterestCalculator/compoundInterestCalculator';
import { CompoundInterestInputs } from '../src/interfaces/LoanCalculator/compoundInterestInputs';

const inputs: CompoundInterestInputs = {
  principal: 20000,
  annualRate: 6,
  compoundingFrequency: 6, // Quarterly
  years: 1,
//   additionalContribution: 100 // Optional, per period
};

const calculator = new CompoundInterestCalculator(inputs);
const result = calculator.calculate();

console.log('Principal:', result.principal);
console.log('Total Amount:', result.totalAmount);
console.log('Total Interest:', result.totalInterest);
console.log('First 5 periods:', result.schedule);
