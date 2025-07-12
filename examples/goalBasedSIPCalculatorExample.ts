import { GoalBasedSIPCalculator } from "../src/core/GoalBasedSIPCalculator/goalBasedSIPCalculator";
import { GoalBasedSIPInputs } from "../src/interfaces/GoalBasedSipCalculator";


const inputs: GoalBasedSIPInputs = {
  goalAmount: 2000000,
  years: 15,
  annualRate: 11,
};

const calculator = new GoalBasedSIPCalculator(inputs);
const result = calculator.calculate();

console.log('Goal Amount:', result.goalAmount);
console.log('Duration (years):', result.years);
console.log('Expected Rate (%):', result.annualRate);

console.log('Total Investment Required:', result.totalInvestment);
console.log('Monthly SIP Required:', result.monthlyInvestment);

console.log('Yearly Breakdown:');
result.schedule.forEach(item => {
  console.log(`Year ${item.year}: yearlyInterest = ${item.yearlyInterest}, Accumulated Value = ${item.yearEndMaturity}`);
});
