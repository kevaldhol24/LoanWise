// Example usage of the SIP calculator
import { SIPCalculator, InvestmentFrequency } from '../src';

// Example 1: Basic monthly SIP calculation
console.log('Example 1: Basic monthly SIP with ₹5,000 monthly investment for 1 year at 12% return');
const basicSipCalculator = new SIPCalculator({
  monthlyInvestment: 5000,
  annualReturnRate: 12,
  durationMonths: 1 * 12 // 1 year
});

const basicResult = basicSipCalculator.calculate();
console.log(`Total Invested Amount: ₹${basicResult.totalInvestedAmount}`);
console.log(`Maturity Amount: ₹${basicResult.maturityAmount}`);
console.log(`Wealth Gain: ₹${basicResult.wealthGain}`);
console.log('Yearly Breakdown:');
basicResult.yearlyBreakdown.forEach(year => {
  console.log(`Year ${year.year}:`);
  console.log(`  Investment: ₹${year.yearlyInvestment}`);
  console.log(`  Interest Earned: ₹${year.yearlyInterest}`);
  console.log(`  Year-end Value: ₹${year.yearEndMaturity}`);
});
console.log('-'.repeat(80));

// Example 2: SIP with step-up rate
console.log('Example 2: SIP with 10% annual step-up for 3 years');
const stepUpSipCalculator = new SIPCalculator({
  monthlyInvestment: 1000,
  annualReturnRate: 12,
  durationMonths: 3 * 12, // 3 years
  stepUpRate: 10 // 10% annual increase
});

const stepUpResult = stepUpSipCalculator.calculate();
console.log(`Total Invested Amount: ₹${stepUpResult.totalInvestedAmount}`);
console.log(`Maturity Amount: ₹${stepUpResult.maturityAmount}`);
console.log(`Wealth Gain: ₹${stepUpResult.wealthGain}`);
console.log('Yearly Breakdown:');
stepUpResult.yearlyBreakdown.forEach(year => {
  console.log(`Year ${year.year}:`);
  console.log(`  Investment: ₹${year.yearlyInvestment}`);
  console.log(`  Interest Earned: ₹${year.yearlyInterest}`);
  console.log(`  Year-end Value: ₹${year.yearEndMaturity}`);
});
console.log('-'.repeat(80));

// Example 3: SIP with inflation adjustment
console.log('Example 3: SIP with inflation adjustment (5 years)');
const inflationSipCalculator = new SIPCalculator({
  monthlyInvestment: 5000,
  annualReturnRate: 12,
  durationMonths: 5 * 12, // 5 years
  inflationRate: 5 // 5% inflation rate
});

const inflationResult = inflationSipCalculator.calculate();
console.log(`Total Invested Amount: ₹${inflationResult.totalInvestedAmount}`);
console.log(`Nominal Maturity Amount: ₹${inflationResult.maturityAmount}`);
console.log(`Inflation-adjusted Maturity Amount: ₹${inflationResult.inflationAdjustedMaturityAmount}`);
console.log(`Nominal Wealth Gain: ₹${inflationResult.wealthGain}`);
console.log(`Inflation-adjusted Wealth Gain: ₹${inflationResult.inflationAdjustedWealthGain}`);
console.log('Yearly Breakdown with Inflation Adjustment:');
inflationResult.yearlyBreakdown.forEach(year => {
  console.log(`Year ${year.year}:`);
  console.log(`  Investment: ₹${year.yearlyInvestment}`);
  console.log(`  Nominal Interest: ₹${year.yearlyInterest}`);
  console.log(`  Inflation-adjusted Interest: ₹${year.inflationAdjustedYearlyInterest}`);
  console.log(`  Nominal Year-end Value: ₹${year.yearEndMaturity}`);
  console.log(`  Inflation-adjusted Year-end Value: ₹${year.inflationAdjustedYearEndMaturity}`);
});
console.log('-'.repeat(80));

// Example 4: Different investment frequencies
console.log('Example 4: Quarterly investments for 3 years');
const quarterlySipCalculator = new SIPCalculator({
  monthlyInvestment: 5000, // This becomes 15,000 per quarter
  annualReturnRate: 12,
  durationMonths: 3 * 12, // 3 years
  investmentFrequency: InvestmentFrequency.QUARTERLY
});

const quarterlyResult = quarterlySipCalculator.calculate();
console.log(`Total Invested Amount: ₹${quarterlyResult.totalInvestedAmount}`);
console.log(`Maturity Amount: ₹${quarterlyResult.maturityAmount}`);
console.log(`Wealth Gain: ₹${quarterlyResult.wealthGain}`);
console.log('Yearly Breakdown for Quarterly SIP:');
quarterlyResult.yearlyBreakdown.forEach(year => {
  console.log(`Year ${year.year}:`);
  console.log(`  Investment: ₹${year.yearlyInvestment}`);
  console.log(`  Interest Earned: ₹${year.yearlyInterest}`);
  console.log(`  Year-end Value: ₹${year.yearEndMaturity}`);
});
console.log('-'.repeat(80));

// Example 5: SIP comparison (monthly vs quarterly)
console.log('Example 5: Comparing monthly vs quarterly SIP (3 years)');

// Monthly SIP
const monthlySipCalculator = new SIPCalculator({
  monthlyInvestment: 5000,
  annualReturnRate: 12,
  durationMonths: 3 * 12 // 3 years
});
const monthlyResult = monthlySipCalculator.calculate();

// Quarterly SIP (same monthly investment, just paid quarterly)
const quarterlyCompareSipCalculator = new SIPCalculator({
  monthlyInvestment: 5000,
  annualReturnRate: 12,
  durationMonths: 3 * 12, // 3 years
  investmentFrequency: InvestmentFrequency.QUARTERLY
});
const quarterlyCompareResult = quarterlyCompareSipCalculator.calculate();

console.log(`Monthly SIP: Maturity Amount: ₹${monthlyResult.maturityAmount}`);
console.log(`Quarterly SIP: Maturity Amount: ₹${quarterlyCompareResult.maturityAmount}`);
console.log(`Difference: ₹${monthlyResult.maturityAmount - quarterlyCompareResult.maturityAmount}`);

console.log('Monthly SIP Yearly Breakdown:');
monthlyResult.yearlyBreakdown.forEach(year => {
  console.log(`Year ${year.year}: ₹${year.yearEndMaturity}`);
});

console.log('Quarterly SIP Yearly Breakdown:');
quarterlyCompareResult.yearlyBreakdown.forEach(year => {
  console.log(`Year ${year.year}: ₹${year.yearEndMaturity}`);
});
console.log('-'.repeat(80));

// Example 6: SIP with both step-up and inflation
console.log('Example 6: SIP with both 10% step-up and 5% inflation (5 years)');
const combinedSipCalculator = new SIPCalculator({
  monthlyInvestment: 10000,
  annualReturnRate: 12,
  durationMonths: 5 * 12, // 5 years
  stepUpRate: 10, // 10% annual increase in investment
  inflationRate: 5 // 5% inflation rate
});

const combinedResult = combinedSipCalculator.calculate();
console.log(`Total Invested Amount: ₹${combinedResult.totalInvestedAmount}`);
console.log(`Nominal Maturity Amount: ₹${combinedResult.maturityAmount}`);
console.log(`Inflation-adjusted Maturity Amount: ₹${combinedResult.inflationAdjustedMaturityAmount}`);
console.log(`Nominal Wealth Gain: ₹${combinedResult.wealthGain}`);
console.log(`Inflation-adjusted Wealth Gain: ₹${combinedResult.inflationAdjustedWealthGain}`);

console.log('Yearly Breakdown with Step-up and Inflation:');
combinedResult.yearlyBreakdown.forEach(year => {
  console.log(`Year ${year.year}:`);
  console.log(`  Investment: ₹${year.yearlyInvestment}`);
  console.log(`  Nominal Interest: ₹${year.yearlyInterest}`);
  console.log(`  Inflation-adjusted Interest: ₹${year.inflationAdjustedYearlyInterest}`);
  console.log(`  Nominal Year-end Value: ₹${year.yearEndMaturity}`);
  console.log(`  Inflation-adjusted Year-end Value: ₹${year.inflationAdjustedYearEndMaturity}`);
});
console.log('-'.repeat(80));
