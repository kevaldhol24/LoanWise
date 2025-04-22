# LoanWise

A comprehensive TypeScript library for detailed loan calculations and amortization schedules.

## Features

- **Basic Loan Calculations**: Calculate EMI, total interest, amortization schedule
- **Prepayment Handling**: Support for one-time and monthly prepayments
- **Interest Rate Changes**: Handle floating rate loans with multiple interest rate changes
- **EMI Adjustments**: Support for increasing or decreasing EMI during the loan term
- **Impact Analysis**: Detailed impact of prepayments and interest rate changes
- **Amortization Schedule**: Generate detailed repayment schedule with principal and interest breakdowns

## Installation

```bash
npm install loanwise
```

## Usage

### Basic Loan Calculation

```typescript
import { AdvancedLoanCalculator, LoanCalculationInputs } from 'loanwise';

const loanInputs: LoanCalculationInputs = {
  loanAmount: 100000,
  initialInterestRate: 7.5,
  startDate: '2023-01-01',
  tenureMonths: 120
};

const calculator = new AdvancedLoanCalculator(loanInputs);
const result = calculator.calculate();

console.log(`Monthly EMI: ${result.summary.emi}`);
console.log(`Total Interest: ${result.summary.totalInterestPayable}`);
console.log(`Total Amount: ${result.summary.totalAmountPayable}`);
```

### Loan with Prepayments

```typescript
import { AdvancedLoanCalculator, LoanCalculationInputs } from 'loanwise';

const loanInputs: LoanCalculationInputs = {
  loanAmount: 100000,
  initialInterestRate: 7.5,
  startDate: '2023-01-01',
  tenureMonths: 120,
  prepayments: [
    {
      id: 'bonus1',
      amount: 10000,
      type: 'onetime',
      startDate: '2023-06-01',
      impact: 'tenure' // Reduce tenure, keep EMI same
    },
    {
      id: 'monthly',
      amount: 500,
      type: 'monthly',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      impact: 'EMI' // Reduce EMI, keep tenure same
    }
  ]
};

const calculator = new AdvancedLoanCalculator(loanInputs);
const result = calculator.calculate();

// Get the impact of prepayments
console.log(result.impacts?.prepaymentImpacts);
```

### Loan with Interest Rate Changes

```typescript
import { AdvancedLoanCalculator, LoanCalculationInputs } from 'loanwise';

const loanInputs: LoanCalculationInputs = {
  loanAmount: 100000,
  initialInterestRate: 7.5,
  startDate: '2023-01-01',
  tenureMonths: 120,
  interestRateChanges: [
    {
      id: 'rate1',
      rate: 8.0,
      effectiveDate: '2024-01-01',
      impact: 'EMI' // Increase EMI, keep tenure same
    }
  ]
};

const calculator = new AdvancedLoanCalculator(loanInputs);
const result = calculator.calculate();

// Get the impact of interest rate changes
console.log(result.impacts?.interestRateChangeImpacts);
```

### Loan with EMI Changes

```typescript
import { AdvancedLoanCalculator, LoanCalculationInputs } from 'loanwise';

const loanInputs: LoanCalculationInputs = {
  loanAmount: 100000,
  initialInterestRate: 7.5,
  startDate: '2023-01-01',
  tenureMonths: 120,
  emiChanges: [
    {
      id: 'emi1',
      emi: 1300, // New EMI amount
      startDate: '2024-01-01'
    }
  ]
};

const calculator = new AdvancedLoanCalculator(loanInputs);
const result = calculator.calculate();

// Get the impact of EMI changes
console.log(result.impacts?.emiChangeImpacts);
```

### Combined Example with All Features

See the `examples/usage.ts` file for a complete example using all features together.

## API Reference

### Data Structures

#### Input Interfaces

- `BasicLoanInputs`: Basic inputs for loan calculation
- `LoanCalculationInputs`: Extended inputs including prepayments, interest rate changes, EMI changes
- `Prepayment`: Definition for a loan prepayment
- `InterestRateChange`: Definition for an interest rate change
- `EMIChange`: Definition for an EMI change

#### Output Interfaces

- `LoanCalculationOutput`: Complete calculation output
- `LoanSummary`: Summary of loan calculation
- `EMIScheduleItem`: Single item in the amortization schedule
- `ImpactSummary`: Summary of impacts from prepayments, interest rate changes, etc.

### Core Classes

- `BaseLoanCalculator`: Handles basic loan calculations
- `AdvancedLoanCalculator`: Extends base calculator with support for prepayments, interest rate changes, etc.

### Utility Functions

- Date utilities: `addMonths`, `getMonthsDifference`, etc.
- Financial utilities: `calculateEMI`, `calculateTenure`, etc.

## Requirements

- TypeScript 4.0+
- Node.js 14+

## License

ISC

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build
```