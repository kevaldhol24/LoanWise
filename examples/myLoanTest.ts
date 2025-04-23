import { AdvancedLoanCalculator, LoanCalculationInputs, Prepayment, InterestRateChange, EMIChange, EMIScheduleItem } from '../src';


// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  // Foreground (text) colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Format currency strings
const formatCurrency = (value: number): string => {
  return `${colors.green}$${value.toFixed(2)}${colors.reset}`;
};

// Format percentage values
const formatPercent = (value: number): string => {
  return `${colors.magenta}${value}%${colors.reset}`;
};

// Format dates
const formatDate = (date: string): string => {
  return `${colors.cyan}${date}${colors.reset}`;
};

// Format section headers
const formatHeader = (text: string): string => {
  return `\n${colors.bright}${colors.bgBlue}${colors.white} ${text} ${colors.reset}`;
};

// Format sub-headers
const formatSubHeader = (text: string): string => {
  return `\n${colors.yellow}${colors.bright}${text}${colors.reset}`;
};

// Format labels
const formatLabel = (label: string): string => {
  return `${colors.dim}${label}:${colors.reset}`;
};


/**
 * LoanWise Library Playground
 * --------------------------
 * Modify the values below to test different loan scenarios
 */

// ======= MODIFY THESE VALUES TO TEST DIFFERENT SCENARIOS =======
const loanConfig1: LoanCalculationInputs = {
  // Basic loan parameters
  loanAmount: 1000000,               // Total loan amount
  initialInterestRate: 10,         // Interest rate in percentage
  startDate: '2025-04-01',          // Loan start date
  tenureMonths: 120,                // Loan tenure in months (10 years)
  
  // output
  // LOAN SUMMARY 
  // Loan Amount: $1000000.00
  // Interest Rate: 10%
  // Loan Term: 120 months (10.0 years)
  // Start Date: 2025-04-01
  // Monthly EMI: $13215.07
  // Total Interest: $585809.13
  // Total Amount Payable: $1585809.13
  // Final Payment Date: 2035-04-01
  // Actual Tenure: 121 months
  
  //  PAYMENT SCHEDULE SAMPLES 
  
  // Initial Payments
  // 1. 2025-04-01 | EMI: $13215.07 | Interest: $8333.33 | Principal: $4881.74 | Balance: $995118.26
  // 2. 2025-05-01 | EMI: $13215.07 | Interest: $8292.65 | Principal: $4922.42 | Balance: $990195.84
  // 3. 2025-06-01 | EMI: $13215.07 | Interest: $8251.63 | Principal: $4963.44 | Balance: $985232.40
  
  // Mid-term Payments
  // 60. 2030-03-01 | EMI: $13215.07 | Interest: $5249.48 | Principal: $7965.59 | Balance: $621972.59
  // 61. 2030-04-01 | EMI: $13215.07 | Interest: $5183.10 | Principal: $8031.97 | Balance: $613940.62
  // 62. 2030-05-01 | EMI: $13215.07 | Interest: $5116.17 | Principal: $8098.90 | Balance: $605841.72
  
  // Final Payments
  // 119. 2035-02-01 | EMI: $13215.07 | Interest: $217.53 | Principal: $12997.54 | Balance: $13106.57
  // 120. 2035-03-01 | EMI: $13215.07 | Interest: $109.22 | Principal: $13105.85 | Balance: $0.72
  // 121. 2035-04-01 | EMI: $0.73 | Interest: $0.01 | Principal: $0.72 | Balance: $0.00
};

const loanConfig2: LoanCalculationInputs = {
  // Basic loan parameters
  loanAmount: 1000000,               // Total loan amount
  initialInterestRate: 10,         // Interest rate in percentage
  startDate: '2025-04-01',          // Loan start date
  tenureMonths: 120,                // Loan tenure in months (10 years)
  
  // Optional: Add prepayments (comment out if not needed)
  prepayments: [
    {
      id: 'Year-bonus',
      amount: 100000,               // Amount to prepay
      type: 'onetime',             // 'onetime' or 'monthly'
      startDate: '2025-10-01',     // When the prepayment happens
      // startDate: '2025-06-01',     // When the prepayment happens
      impact: 'tenure'             // 'tenure' (reduce loan period) or 'emi' (reduce monthly payment)
    },
    {
      id: 'YearLy-bonus',
      amount: 100000,               // Amount to prepay
      type: 'onetime',             // 'onetime' or 'monthly'
      startDate: '2026-02-01',     // When the prepayment happens
      // startDate: '2025-06-01',     // When the prepayment happens
      impact: 'tenure'             // 'tenure' (reduce loan period) or 'emi' (reduce monthly payment)
    },
    // {
    //   id: 'Savings',
    //   amount: 10000,               // Amount to prepay
    //   type: 'onetime',             // 'onetime' or 'monthly'
    //   startDate: '2025-11-01',     // When the prepayment happens
    //   impact: 'tenure'             // 'tenure' (reduce loan period) or 'emi' (reduce monthly payment)
    // }
  ],
  
  // Optional: Add interest rate changes (comment out if not needed)
  // interestRateChanges: [
  //   {
  //     id: 'rate-adjustment',
  //     rate: 8.0,                   // New interest rate
  //     effectiveDate: '2026-06-01', // When the rate change takes effect
  //     impact: 'EMI'                // 'EMI' or 'tenure'
  //   }
  // ],
  
  // Optional: Add EMI changes (comment out if not needed)
  // emiChanges: [
  //   {
  //     id: 'payment-increase',
  //     emi: 10000,                   // New EMI amount
  //     startDate: '2027-01-01'      // When the EMI change takes effect
  //   } as EMIChange
  // ]
};

// ======= LOAN CALCULATION AND RESULTS DISPLAY =======
const loanConfig = loanConfig2;
// Create calculator instance with your configuration
const calculator = new AdvancedLoanCalculator(loanConfig);
const result = calculator.calculate();

// Display basic loan summary
console.log(formatHeader('LOAN SUMMARY'));
console.log(`${formatLabel('Loan Amount')} ${formatCurrency(loanConfig.loanAmount)}`);
console.log(`${formatLabel('Interest Rate')} ${formatPercent(loanConfig.initialInterestRate)}`);
console.log(`${formatLabel('Loan Term')} ${colors.white}${loanConfig.tenureMonths} months (${(loanConfig.tenureMonths / 12).toFixed(1)} years)${colors.reset}`);
console.log(`${formatLabel('Start Date')} ${formatDate(loanConfig.startDate)}`);
console.log(`${formatLabel('Monthly EMI')} ${formatCurrency(result.summary.emi)}`);
console.log(`${formatLabel('Total Interest')} ${formatCurrency(result.summary.totalInterestPayable)}`);
console.log(`${formatLabel('Total Amount Payable')} ${formatCurrency(result.summary.totalAmountPayable)}`);
console.log(`${formatLabel('Final Payment Date')} ${formatDate(result.summary.lastPaymentDate)}`);
console.log(`${formatLabel('Actual Tenure')} ${colors.white}${result.summary.totalEMIs} months${colors.reset}`);

// Display prepayment impact if any prepayments were made
if (result.impacts?.prepaymentImpacts && result.impacts.prepaymentImpacts.length > 0) {
  console.log(formatHeader('PREPAYMENT IMPACT'));
  console.log(`${formatLabel('Total Prepayment')} ${formatCurrency(result.summary.totalPrepayment)}`);
  
  result.impacts.prepaymentImpacts.forEach(impact => {
    console.log(formatSubHeader(`Prepayment: ${impact.prepaymentId}`));
    console.log(`${formatLabel('Amount')} ${formatCurrency(impact.totalPrepaymentAmount)}`);
    console.log(`${formatLabel('Interest Saved')} ${formatCurrency(impact.interestSaved)}`);
    console.log(`${formatLabel('Months Reduced')} ${colors.white}${impact.monthsReduced}${colors.reset}`);
  });
}

// Display interest rate change impacts
if (result.impacts?.interestRateChangeImpacts && result.impacts.interestRateChangeImpacts.length > 0) {
  console.log(formatHeader('INTEREST RATE CHANGE IMPACT'));
  
  result.impacts.interestRateChangeImpacts.forEach(impact => {
    console.log(formatSubHeader(`Change: ${impact.interestChangeId}`));
    console.log(`${formatLabel('Rate Change')} ${formatPercent(impact.oldRate)} → ${formatPercent(impact.newRate)}`);
    console.log(`${formatLabel('EMI Change')} ${formatCurrency(impact.oldEMI)} → ${formatCurrency(impact.newEMI)}`);
    console.log(`${formatLabel('Tenure Change')} ${colors.white}${impact.tenureChange} months${colors.reset}`);
    console.log(`${formatLabel('Interest Difference')} ${formatCurrency(impact.interestDifference)}`);
  });
}

// Display EMI change impacts
if (result.impacts?.emiChangeImpacts && result.impacts.emiChangeImpacts.length > 0) {
  console.log(formatHeader('EMI CHANGE IMPACT'));
  
  result.impacts.emiChangeImpacts.forEach(impact => {
    console.log(formatSubHeader(`Change: ${impact.emiChangeId}`));
    console.log(`${formatLabel('EMI Change')} ${formatCurrency(impact.oldEMI)} → ${formatCurrency(impact.newEMI)}`);
    console.log(`${formatLabel('Tenure Change')} ${colors.white}${impact.tenureChange} months${colors.reset}`);
    console.log(`${formatLabel('Interest Difference')} ${formatCurrency(impact.interestDifference)}`);
  });
}

// Display payment schedule samples
console.log(formatHeader('PAYMENT SCHEDULE SAMPLES'));

// Helper function to format payment rows
const formatPaymentRow = (number: number, payment: EMIScheduleItem) => {
  return `${colors.bright}${colors.white}${number}.${colors.reset} ${formatDate(payment.date)} | ` +
         `${formatLabel('EMI')} ${formatCurrency(payment.emiAmount)} | ` +
         `${formatLabel('Interest')} ${formatCurrency(payment.interestPaid)} | ` +
         `${formatLabel('Principal')} ${formatCurrency(payment.principalPaid)} | ` +
         `${formatLabel('Balance')} ${formatCurrency(payment.remainingBalance)}`;
};

// First 3 payments
console.log(formatSubHeader('Initial Payments'));
result.schedule.slice(0, 5).forEach((payment, index) => {
  console.log(formatPaymentRow(index + 1, payment));
});

// Middle 3 payments (around midpoint of loan)
const midPoint = Math.floor(result.schedule.length / 2);
console.log(formatSubHeader('Mid-term Payments'));
result.schedule.slice(midPoint - 2, midPoint + 3).forEach((payment, index) => {
  console.log(formatPaymentRow(midPoint + index - 1, payment));
});

// Last 3 payments
console.log(formatSubHeader('Final Payments'));
result.schedule.slice(-5).forEach((payment, index) => {
  const paymentNumber = result.schedule.length - 5 + index + 1;
  console.log(formatPaymentRow(paymentNumber, payment));
});