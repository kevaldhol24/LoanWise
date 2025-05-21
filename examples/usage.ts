import { AdvancedLoanCalculator, ImpactType, LoanCalculationInputs, PrepaymentFrequency } from '../src';

/**
 * This example demonstrates how to use the LoanWise library to calculate various loan scenarios
 */

// Basic loan calculation example
const basicLoan = () => {
  const basicInput: LoanCalculationInputs = {
    loanAmount: 300000,
    initialInterestRate: 8.5,
    startDate: '2023-01-01',
    tenureMonths: 240 // 20 years
  };

  const calculator = new AdvancedLoanCalculator(basicInput);
  const result = calculator.calculate();

  console.log('===== Basic Mortgage Loan =====');
  console.log(`Loan Amount: $${basicInput.loanAmount}`);
  console.log(`Interest Rate: ${basicInput.initialInterestRate}%`);
  console.log(`Tenure: ${basicInput.tenureMonths} months (${basicInput.tenureMonths / 12} years)`);
  console.log(`Monthly EMI: $${result.summary.emi.toFixed(2)}`);
  console.log(`Total Interest: $${result.summary.totalInterestPayable.toFixed(2)}`);
  console.log(`Total Amount Payable: $${result.summary.totalAmountPayable.toFixed(2)}`);
  console.log(`Last Payment Date: ${result.summary.lastPaymentDate}`);
  console.log('============================\n');
};

// Example with prepayments
const loanWithPrepayments = () => {
  const inputWithPrepayments: LoanCalculationInputs = {
    loanAmount: 300000,
    initialInterestRate: 8.5,
    startDate: '2023-01-01',
    tenureMonths: 240, // 20 years
    prepayments: [
      {
        id: 'annual-bonus',
        amount: 10000,
        type: PrepaymentFrequency.Onetime,
        startDate: '2023-12-15',
        impact: ImpactType.Tenure
      },
      {
        id: 'monthly-extra',
        amount: 500,
        type: PrepaymentFrequency.Monthly,
        startDate: '2024-01-01',
        impact: ImpactType.Tenure
      }
    ]
  };

  const calculator = new AdvancedLoanCalculator(inputWithPrepayments);
  const result = calculator.calculate();

  console.log('===== Loan With Prepayments =====');
  console.log(`Original Tenure: ${inputWithPrepayments.tenureMonths} months`);
  console.log(`New Tenure After Prepayments: ${result.summary.totalEMIs} months`);
  console.log(`Months Reduced: ${inputWithPrepayments.tenureMonths - result.summary.totalEMIs} months`);
  console.log(`Total Prepayment: $${result.summary.totalPrepayment.toFixed(2)}`);
  console.log(`Total Interest: $${result.summary.totalInterestPayable.toFixed(2)}`);
  
  // Show prepayment impacts
  if (result.impacts?.prepaymentImpacts) {
    result.impacts.prepaymentImpacts.forEach(impact => {
      console.log(`\nPrepayment ID: ${impact.prepaymentId}`);
      console.log(`Total Prepayment Amount: $${impact.totalPrepaymentAmount.toFixed(2)}`);
      console.log(`Interest Saved: $${impact.interestSaved.toFixed(2)}`);
      console.log(`Months Reduced: ${impact.monthsReduced}`);
    });
  }
  console.log('============================\n');
};

// Example with interest rate changes
const loanWithInterestRateChanges = () => {
  const inputWithInterestChanges: LoanCalculationInputs = {
    loanAmount: 300000,
    initialInterestRate: 8.5,
    startDate: '2023-01-01',
    tenureMonths: 240, // 20 years
    interestRateChanges: [
      {
        id: 'rate-increase',
        rate: 9.5,
        effectiveDate: '2024-01-01',
        impact: ImpactType.EMI // Increase EMI, keep tenure same
      },
      {
        id: 'rate-decrease',
        rate: 7.5,
        effectiveDate: '2025-01-01',
        impact: ImpactType.Tenure // Keep EMI same, reduce tenure
      }
    ]
  };

  const calculator = new AdvancedLoanCalculator(inputWithInterestChanges);
  const result = calculator.calculate();

  console.log('===== Loan With Interest Rate Changes =====');
  console.log(`Original Tenure: ${inputWithInterestChanges.tenureMonths} months`);
  console.log(`Final Tenure: ${result.summary.totalEMIs} months`);
  console.log(`Original EMI: $${result.summary.emi.toFixed(2)}`);
  
  // Show interest rate change impacts
  if (result.impacts?.interestRateChangeImpacts) {
    result.impacts.interestRateChangeImpacts.forEach(impact => {
      console.log(`\nInterest Change ID: ${impact.interestChangeId}`);
      console.log(`Old Rate: ${impact.oldRate}%, New Rate: ${impact.newRate}%`);
      console.log(`Old EMI: $${impact.oldEMI.toFixed(2)}, New EMI: $${impact.newEMI.toFixed(2)}`);
      console.log(`Tenure Change: ${impact.tenureChange} months`);
      console.log(`Interest Difference: $${impact.interestDifference.toFixed(2)}`);
    });
  }
  console.log('============================\n');
};

// Example with EMI changes
const loanWithEMIChanges = () => {
  const inputWithEMIChanges: LoanCalculationInputs = {
    loanAmount: 300000,
    initialInterestRate: 8.5,
    startDate: '2023-01-01',
    tenureMonths: 240, // 20 years
    emiChanges: [
      {
        id: 'salary-increase',
        emi: 3000, // Increase EMI due to salary increase
        startDate: '2024-01-01'
      }
    ]
  };

  const calculator = new AdvancedLoanCalculator(inputWithEMIChanges);
  const result = calculator.calculate();

  console.log('===== Loan With EMI Changes =====');
  console.log(`Original Tenure: ${inputWithEMIChanges.tenureMonths} months`);
  console.log(`Final Tenure: ${result.summary.totalEMIs} months`);
  console.log(`Months Reduced: ${inputWithEMIChanges.tenureMonths - result.summary.totalEMIs} months`);
  console.log(`Original EMI: $${result.summary.emi.toFixed(2)}`);
  
  // Show EMI change impacts
  if (result.impacts?.emiChangeImpacts) {
    result.impacts.emiChangeImpacts.forEach(impact => {
      console.log(`\nEMI Change ID: ${impact.emiChangeId}`);
      console.log(`Old EMI: $${impact.oldEMI.toFixed(2)}, New EMI: $${impact.newEMI.toFixed(2)}`);
      console.log(`Tenure Change: ${impact.tenureChange} months`);
      console.log(`Interest Difference: $${impact.interestDifference.toFixed(2)}`);
    });
  }
  console.log('============================\n');
};

// Combined example with multiple features
const combinedExample = () => {
  const combinedInput: LoanCalculationInputs = {
    loanAmount: 300000,
    initialInterestRate: 8.5,
    startDate: '2023-01-01',
    tenureMonths: 240, // 20 years
    prepayments: [
      {
        id: 'annual-bonus',
        amount: 15000,
        type: PrepaymentFrequency.Onetime,
        startDate: '2023-12-15',
        impact: ImpactType.Tenure
      }
    ],
    interestRateChanges: [
      {
        id: 'market-adjustment',
        rate: 7.75,
        effectiveDate: '2024-06-01',
        impact: ImpactType.EMI
      }
    ],
    emiChanges: [
      {
        id: 'payment-adjustment',
        emi: 2800,
        startDate: '2025-01-01'
      }
    ]
  };

  const calculator = new AdvancedLoanCalculator(combinedInput);
  const result = calculator.calculate();

  console.log('===== Combined Loan Scenario =====');
  console.log(`Original Loan: $${combinedInput.loanAmount} at ${combinedInput.initialInterestRate}% for ${combinedInput.tenureMonths} months`);
  console.log(`Final Tenure: ${result.summary.totalEMIs} months`);
  console.log(`Total Interest Paid: $${result.summary.totalInterestPayable.toFixed(2)}`);
  console.log(`Total Prepayments: $${result.summary.totalPrepayment.toFixed(2)}`);
  console.log(`Last Payment Date: ${result.summary.lastPaymentDate}`);
  console.log('============================\n');
  
  // Print a sample of the payment schedule
  console.log('Sample Payment Schedule (first 5 payments):');
  result.schedule.slice(0, 5).forEach(payment => {
    console.log(`${payment.date} | EMI: $${payment.emiAmount.toFixed(2)} | Interest: $${payment.interestPaid.toFixed(2)} | Principal: $${payment.principalPaid.toFixed(2)} | Remaining: $${payment.remainingBalance.toFixed(2)}`);
  });
  
  console.log('\nSample Payment Schedule (last 5 payments):');
  result.schedule.slice(-5).forEach(payment => {
    console.log(`${payment.date} | EMI: $${payment.emiAmount.toFixed(2)} | Interest: $${payment.interestPaid.toFixed(2)} | Principal: $${payment.principalPaid.toFixed(2)} | Remaining: $${payment.remainingBalance.toFixed(2)}`);
  });
};

// Run all examples
basicLoan();
loanWithPrepayments();
loanWithInterestRateChanges();
loanWithEMIChanges();
combinedExample();