import { LumpsumCalculator } from '../src/core/LumpsumCalculator/lumpsumCalculator';
import { LumpsumInputs } from '../src/interfaces/LumpsumSipCalculator/lumpsumInputs';

const inputs: LumpsumInputs = {
  principal: 15000,
  annualRate: 12,
  years: 8,
};

const calculator = new LumpsumCalculator(inputs);
const result = calculator.calculate();

console.log('Principal:', result.principal);
console.log('Total Amount:', result.totalAmount);
console.log('Total Interest:', result.totalInterest);
console.log('Schedule:');
result.schedule.forEach(entry => {
  console.log(`  Year ${entry.year}: Start Amount = ${entry.startAmount}, Interest = ${entry.interest}, End Amount = ${entry.endAmount}`);
});