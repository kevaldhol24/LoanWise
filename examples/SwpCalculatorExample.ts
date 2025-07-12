
import { SwpCalculator } from "../src/core/SwpCalculator/SwpCalculator";
import { SwpInputs } from "../src/interfaces/SwpCalculator";

const inputs: SwpInputs = {
  principal: 100000,
  annualRate: 12,
  years: 1,
  monthlyWithDrawal: 1000000
};

const calculator = new SwpCalculator(inputs);
const result = calculator.calculate();

console.log('Principal:', result.principal);
console.log('Total Amount:', result.totalAmount);
console.log('Total Interest:', result.totalInterest);
console.log('First 5 periods:', result.schedule);
