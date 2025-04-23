# LoanWise Library Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Key Features](#key-features)
4. [Core Classes](#core-classes)
   - [BaseLoanCalculator](#baseloan-calculator)
   - [AdvancedLoanCalculator](#advancedloan-calculator)
5. [Input Interfaces](#input-interfaces)
   - [BasicLoanInputs](#basicloaninputs)
   - [LoanCalculationInputs](#loancalculationinputs)
   - [Prepayment](#prepayment)
   - [InterestRateChange](#interestratechange)
   - [EMIChange](#emichange)
6. [Output Interfaces](#output-interfaces)
   - [LoanCalculationOutput](#loancalculationoutput)
   - [LoanSummary](#loansummary)
   - [EMIScheduleItem](#emischeduleitem)
   - [ImpactSummary](#impactsummary)
7. [Utility Functions](#utility-functions)
   - [Date Utilities](#date-utilities)
   - [Financial Utilities](#financial-utilities)
8. [Usage Examples](#usage-examples)
   - [Basic Loan Calculation](#basic-loan-calculation)
   - [Loan with Prepayments](#loan-with-prepayments)
   - [Loan with Interest Rate Changes](#loan-with-interest-rate-changes)
   - [Loan with EMI Changes](#loan-with-emi-changes)
   - [Combined Scenario](#combined-scenario)
9. [Best Practices](#best-practices)
10. [Error Handling](#error-handling)

## 1. Introduction

LoanWise is a comprehensive TypeScript library designed for detailed loan calculations and amortization schedules. It provides tools to calculate loan repayment schedules with flexible options including fixed and floating interest rates, prepayments, and EMI changes. The library produces detailed amortization schedules and impact summaries of any changes made to the loan during its tenure.

## 2. Installation

```bash
npm install loanwise
```

## 3. Key Features

- **Basic Loan Calculations**: Calculate EMI, total interest, and complete amortization schedule
- **Prepayment Handling**: Support for both one-time and recurring monthly prepayments
- **Interest Rate Changes**: Handle floating rate loans with multiple interest rate changes
- **EMI Adjustments**: Support for increasing or decreasing EMI during the loan term
- **Impact Analysis**: Detailed impact calculations for prepayments, interest rate changes, and EMI changes
- **Amortization Schedule**: Generate detailed payment schedule with principal and interest breakdown

## 4. Core Classes

### BaseLoanCalculator

The `BaseLoanCalculator` class handles standard loan calculations with fixed interest rates and no prepayments or EMI changes.

#### Constructor

```typescript
constructor(inputs: BasicLoanInputs)
```

- **inputs**: Basic parameters for loan calculation (amount, interest rate, tenure, start date)

#### Methods

##### calculate()

```typescript
public calculate(): LoanCalculationOutput
```

- **Returns**: Complete loan calculation output with schedule and summary
- **Description**: Calculates the loan amortization schedule and generates summary

##### validateInputs()

```typescript
protected validateInputs(inputs: BasicLoanInputs): void
```

- **inputs**: Basic loan inputs to validate
- **Description**: Validates that loan amount, interest rate, and tenure are valid
- **Throws**: Error if any inputs are invalid

##### generateSchedule()

```typescript
protected generateSchedule(): EMIScheduleItem[]
```

- **Returns**: Array of EMI schedule items
- **Description**: Generates the complete EMI payment schedule

##### generateSummary()

```typescript
protected generateSummary(schedule: EMIScheduleItem[]): LoanSummary
```

- **schedule**: EMI schedule items
- **Returns**: Loan summary
- **Description**: Generates summary information based on the schedule

### AdvancedLoanCalculator

The `AdvancedLoanCalculator` extends `BaseLoanCalculator` to handle advanced features like prepayments, interest rate changes, and EMI changes.

#### Constructor

```typescript
constructor(inputs: LoanCalculationInputs)
```

- **inputs**: Complete loan calculation inputs including optional prepayments, interest rate changes, and EMI changes

#### Methods

##### calculate()

```typescript
public calculate(): LoanCalculationOutput
```

- **Returns**: Complete loan calculation output with schedule, summary, and impacts
- **Description**: Calculates loan amortization with all advanced features

##### generateSchedule()

```typescript
protected generateSchedule(): EMIScheduleItem[]
```

- **Returns**: Array of EMI schedule items
- **Description**: Generates EMI schedule accounting for prepayments, interest rate changes, and EMI changes

##### validatePrepayments()

```typescript
private validatePrepayments(): void
```

- **Description**: Validates all prepayment inputs
- **Throws**: Error if any prepayment is invalid

##### validateInterestRateChanges()

```typescript
private validateInterestRateChanges(): void
```

- **Description**: Validates all interest rate change inputs
- **Throws**: Error if any interest rate change is invalid

##### validateEMIChanges()

```typescript
private validateEMIChanges(): void
```

- **Description**: Validates all EMI change inputs
- **Throws**: Error if any EMI change is invalid

##### applyEMIChange()

```typescript
private applyEMIChange(currentDate: string, currentEMI: number, remainingBalance: number, currentInterestRate: number): void
```

- **Parameters**:
  - **currentDate**: Current date in ISO format
  - **currentEMI**: Reference to current EMI amount
  - **remainingBalance**: Current remaining balance
  - **currentInterestRate**: Current interest rate
- **Description**: Applies EMI changes for the current month if applicable

##### applyInterestRateChange()

```typescript
private applyInterestRateChange(currentDate: string, currentEMI: number, remainingBalance: number, currentInterestRate: number): void
```

- **Parameters**: Same as applyEMIChange
- **Description**: Applies interest rate changes for the current month if applicable

##### calculatePrepaymentForMonth()

```typescript
private calculatePrepaymentForMonth(currentDate: string, remainingBalance: number): number
```

- **Parameters**:
  - **currentDate**: Current date in ISO format
  - **remainingBalance**: Current remaining loan balance
- **Returns**: Total prepayment amount for the month
- **Description**: Calculates prepayment amount for the current month

##### calculatePrepaymentImpact()

```typescript
private calculatePrepaymentImpact(prepayment: Prepayment, remainingBalance: number, prepaymentAmount: number): void
```

- **Parameters**:
  - **prepayment**: Prepayment definition
  - **remainingBalance**: Current remaining balance
  - **prepaymentAmount**: Actual prepayment amount
- **Description**: Calculates and stores the impact of a prepayment

## 5. Input Interfaces

### BasicLoanInputs

Defines the basic parameters required for any loan calculation.

```typescript
interface BasicLoanInputs {
  /** Total loan principal amount */
  loanAmount: number;
  
  /** Interest rate at the start of the loan (annual percentage) */
  initialInterestRate: number;
  
  /** Loan start date in ISO format (YYYY-MM-DD) */
  startDate: string;
  
  /** Number of months for repayment */
  tenureMonths: number;
}
```

### LoanCalculationInputs

Extends `BasicLoanInputs` to include optional arrays for prepayments, interest rate changes, and EMI changes.

```typescript
interface LoanCalculationInputs extends BasicLoanInputs {
  /** Array of prepayments */
  prepayments?: Prepayment[];
  
  /** Array of interest rate changes */
  interestRateChanges?: InterestRateChange[];
  
  /** Array of EMI changes */
  emiChanges?: EMIChange[];
}
```

### Prepayment

Defines the structure of a prepayment.

```typescript
interface Prepayment {
  /** Unique identifier for the prepayment */
  id: string;
  
  /** Prepayment amount */
  amount: number;
  
  /** Type of prepayment: 'monthly' for recurring or 'onetime' for single payment */
  type: 'monthly' | 'onetime';
  
  /** Date of first/only prepayment in ISO format */
  startDate: string;
  
  /** Optional end date for monthly prepayments in ISO format */
  endDate?: string;
  
  /** Impact type: 'EMI' to reduce monthly payment or 'tenure' to reduce loan duration */
  impact: 'EMI' | 'tenure';
}
```

### InterestRateChange

Defines the structure of an interest rate change.

```typescript
interface InterestRateChange {
  /** Unique identifier for the interest rate change */
  id: string;
  
  /** New interest rate (annual percentage) */
  rate: number;
  
  /** Date when the rate change takes effect in ISO format */
  effectiveDate: string;
  
  /** Impact type: 'EMI' to adjust monthly payment or 'tenure' to adjust loan duration */
  impact: 'EMI' | 'tenure';
}
```

### EMIChange

Defines the structure of an EMI change.

```typescript
interface EMIChange {
  /** Unique identifier for the EMI change */
  id: string;
  
  /** New EMI amount */
  emi: number;
  
  /** Date from which new EMI applies in ISO format */
  startDate: string;
}
```

## 6. Output Interfaces

### LoanCalculationOutput

Defines the complete output of a loan calculation.

```typescript
interface LoanCalculationOutput {
  /** Summary of the loan */
  summary: LoanSummary;
  
  /** Detailed EMI schedule */
  schedule: EMIScheduleItem[];
  
  /** Summary of impacts from changes */
  impacts?: ImpactSummary;
}
```

### LoanSummary

Provides a summary of the loan calculation.

```typescript
interface LoanSummary {
  /** Total loan principal amount */
  loanAmount: number;
  
  /** Equated Monthly Installment amount */
  emi: number;
  
  /** Total interest payable over the loan term */
  totalInterestPayable: number;
  
  /** Total amount payable (principal + interest) */
  totalAmountPayable: number;
  
  /** Last payment date in ISO format */
  lastPaymentDate: string;
  
  /** Total number of EMIs */
  totalEMIs: number;
  
  /** Total prepayment amount (if any) */
  totalPrepayment: number;
  
  /** Remaining months until loan completion */
  remainingMonths: number;
}
```

### EMIScheduleItem

Represents a single payment in the loan amortization schedule.

```typescript
interface EMIScheduleItem {
  /** EMI count (sequential number) */
  emiNumber: number;
  
  /** Year of the EMI payment */
  year: number;
  
  /** Month of the EMI payment (1-12) */
  month: number;
  
  /** EMI date in ISO format */
  date: string;
  
  /** EMI amount for this period */
  emiAmount: number;
  
  /** Interest portion of the EMI */
  interestPaid: number;
  
  /** Principal portion of the EMI */
  principalPaid: number;
  
  /** Prepayment amount (if any) */
  prepayment: number;
  
  /** Remaining balance after this payment */
  remainingBalance: number;
  
  /** Principal paid until this payment */
  principalPaidTillDate: number;
  
  /** Total monthly payment (EMI + prepayment) */
  totalMonthlyPayment: number;
}
```

### ImpactSummary

Provides a summary of the impacts of various changes made to the loan.

```typescript
interface ImpactSummary {
  /** Impacts from prepayments */
  prepaymentImpacts: PrepaymentImpact[];
  
  /** Impacts from interest rate changes */
  interestRateChangeImpacts: InterestRateChangeImpact[];
  
  /** Impacts from EMI changes */
  emiChangeImpacts: EMIChangeImpact[];
}
```

#### PrepaymentImpact

```typescript
interface PrepaymentImpact {
  /** ID of the prepayment */
  prepaymentId: string;
  
  /** Total prepaid amount */
  totalPrepaymentAmount: number;
  
  /** Interest amount saved from prepayment */
  interestSaved: number;
  
  /** Number of months reduced if impact is on tenure */
  monthsReduced: number;
  
  /** EMI reduced if impact is on EMI */
  emiReduced: number;
}
```

#### InterestRateChangeImpact

```typescript
interface InterestRateChangeImpact {
  /** ID of the interest rate change */
  interestChangeId: string;
  
  /** Old interest rate */
  oldRate: number;
  
  /** New interest rate */
  newRate: number;
  
  /** EMI before change */
  oldEMI: number;
  
  /** EMI after change if impact is on EMI */
  newEMI: number;
  
  /** Number of months added/reduced if impact is on tenure */
  tenureChange: number;
  
  /** Change in total interest paid */
  interestDifference: number;
}
```

#### EMIChangeImpact

```typescript
interface EMIChangeImpact {
  /** ID of the EMI change */
  emiChangeId: string;
  
  /** Old EMI amount */
  oldEMI: number;
  
  /** New EMI amount */
  newEMI: number;
  
  /** Number of months added/reduced due to EMI change */
  tenureChange: number;
  
  /** Change in total interest paid */
  interestDifference: number;
}
```

## 7. Utility Functions

### Date Utilities

#### addMonths()

```typescript
function addMonths(dateStr: string, months: number): string
```

- **Parameters**:
  - **dateStr**: Date in ISO format
  - **months**: Number of months to add
- **Returns**: New date in ISO format
- **Description**: Adds specified number of months to a date

#### getMonthsDifference()

```typescript
function getMonthsDifference(startDateStr: string, endDateStr: string): number
```

- **Parameters**: 
  - **startDateStr**: Start date in ISO format
  - **endDateStr**: End date in ISO format
- **Returns**: Number of months between the dates
- **Description**: Calculates difference in months between two dates

#### isBefore()

```typescript
function isBefore(dateStr1: string, dateStr2: string): boolean
```

- **Parameters**:
  - **dateStr1**: First date in ISO format
  - **dateStr2**: Second date in ISO format
- **Returns**: True if dateStr1 is before dateStr2
- **Description**: Checks if one date is before another

#### isAfter()

```typescript
function isAfter(dateStr1: string, dateStr2: string): boolean
```

- **Parameters**: Same as isBefore
- **Returns**: True if dateStr1 is after dateStr2
- **Description**: Checks if one date is after another

#### isBetween()

```typescript
function isBetween(dateToCheck: string, startDateStr: string, endDateStr: string): boolean
```

- **Parameters**:
  - **dateToCheck**: Date to check in ISO format
  - **startDateStr**: Start date in ISO format
  - **endDateStr**: End date in ISO format
- **Returns**: True if dateToCheck is between startDateStr and endDateStr (inclusive)
- **Description**: Checks if a date is between two other dates

#### getYear()

```typescript
function getYear(dateStr: string): number
```

- **Parameters**: **dateStr**: Date in ISO format
- **Returns**: Year as number
- **Description**: Extracts year from a date

#### getMonth()

```typescript
function getMonth(dateStr: string): number
```

- **Parameters**: **dateStr**: Date in ISO format
- **Returns**: Month as number (1-12)
- **Description**: Extracts month from a date

#### sortDates()

```typescript
function sortDates(dates: string[]): string[]
```

- **Parameters**: **dates**: Array of dates in ISO format
- **Returns**: Sorted array of dates
- **Description**: Sorts dates from earliest to latest

### Financial Utilities

#### calculateEMI()

```typescript
function calculateEMI(principal: number, ratePerAnnum: number, tenureMonths: number): number
```

- **Parameters**:
  - **principal**: Principal loan amount
  - **ratePerAnnum**: Annual interest rate in percentage (e.g., 8.5 for 8.5%)
  - **tenureMonths**: Loan tenure in months
- **Returns**: Monthly EMI amount
- **Description**: Calculates the Equated Monthly Installment

#### calculateTenure()

```typescript
function calculateTenure(principal: number, ratePerAnnum: number, emi: number): number
```

- **Parameters**:
  - **principal**: Principal loan amount
  - **ratePerAnnum**: Annual interest rate in percentage
  - **emi**: Monthly EMI amount
- **Returns**: Loan tenure in months
- **Description**: Calculates tenure required for given EMI, principal, and interest rate

#### calculateMinimumEMI()

```typescript
function calculateMinimumEMI(principal: number, ratePerAnnum: number): number
```

- **Parameters**:
  - **principal**: Principal loan amount
  - **ratePerAnnum**: Annual interest rate in percentage
- **Returns**: Minimum EMI amount
- **Description**: Calculates minimum EMI required to cover interest plus some principal

#### calculateMonthlyInterest()

```typescript
function calculateMonthlyInterest(principal: number, ratePerAnnum: number): number
```

- **Parameters**:
  - **principal**: Current principal amount
  - **ratePerAnnum**: Annual interest rate in percentage
- **Returns**: Monthly interest amount
- **Description**: Calculates monthly interest amount

#### roundToDecimal()

```typescript
function roundToDecimal(value: number, decimals: number): number
```

- **Parameters**:
  - **value**: Value to round
  - **decimals**: Number of decimal places
- **Returns**: Rounded value
- **Description**: Rounds a number to specified decimal places

#### isEMISufficient()

```typescript
function isEMISufficient(principal: number, ratePerAnnum: number, emi: number): boolean
```

- **Parameters**:
  - **principal**: Principal loan amount
  - **ratePerAnnum**: Annual interest rate in percentage
  - **emi**: EMI amount to validate
- **Returns**: True if EMI is sufficient, false otherwise
- **Description**: Validates whether EMI is sufficient to cover interest and some principal

## 8. Usage Examples

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

console.log(`Monthly EMI: $${result.summary.emi.toFixed(2)}`);
console.log(`Total Interest: $${result.summary.totalInterestPayable.toFixed(2)}`);
console.log(`Total Amount Payable: $${result.summary.totalAmountPayable.toFixed(2)}`);
console.log(`Last Payment Date: ${result.summary.lastPaymentDate}`);
```

### Loan with Prepayments

```typescript
import { AdvancedLoanCalculator, LoanCalculationInputs, Prepayment } from 'loanwise';

const loanInputs: LoanCalculationInputs = {
  loanAmount: 100000,
  initialInterestRate: 7.5,
  startDate: '2023-01-01',
  tenureMonths: 120,
  prepayments: [
    {
      id: 'annual-bonus',
      amount: 10000,
      type: 'onetime',
      startDate: '2023-06-01',
      impact: 'tenure' // Reduce loan duration, keep EMI the same
    },
    {
      id: 'extra-monthly',
      amount: 200,
      type: 'monthly',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      impact: 'EMI' // Reduce EMI, keep loan duration the same
    }
  ]
};

const calculator = new AdvancedLoanCalculator(loanInputs);
const result = calculator.calculate();

console.log(`Original Tenure: ${loanInputs.tenureMonths} months`);
console.log(`New Tenure After Prepayments: ${result.summary.totalEMIs} months`);
console.log(`Total Prepayment: $${result.summary.totalPrepayment.toFixed(2)}`);

// Examine prepayment impacts
if (result.impacts?.prepaymentImpacts) {
  result.impacts.prepaymentImpacts.forEach(impact => {
    console.log(`\nPrepayment ID: ${impact.prepaymentId}`);
    console.log(`Interest Saved: $${impact.interestSaved.toFixed(2)}`);
    console.log(`Months Reduced: ${impact.monthsReduced}`);
    console.log(`EMI Reduced: $${impact.emiReduced.toFixed(2)}`);
  });
}
```

### Loan with Interest Rate Changes

```typescript
import { AdvancedLoanCalculator, LoanCalculationInputs, InterestRateChange } from 'loanwise';

const loanInputs: LoanCalculationInputs = {
  loanAmount: 100000,
  initialInterestRate: 7.5,
  startDate: '2023-01-01',
  tenureMonths: 120,
  interestRateChanges: [
    {
      id: 'rate-increase',
      rate: 8.0,
      effectiveDate: '2024-01-01',
      impact: 'EMI' // Increase EMI, keep loan duration the same
    },
    {
      id: 'rate-decrease',
      rate: 7.0,
      effectiveDate: '2025-01-01',
      impact: 'tenure' // Keep EMI the same, reduce loan duration
    }
  ]
};

const calculator = new AdvancedLoanCalculator(loanInputs);
const result = calculator.calculate();

// Examine interest rate change impacts
if (result.impacts?.interestRateChangeImpacts) {
  result.impacts.interestRateChangeImpacts.forEach(impact => {
    console.log(`\nRate Change ID: ${impact.interestChangeId}`);
    console.log(`Rate: ${impact.oldRate}% → ${impact.newRate}%`);
    console.log(`EMI: $${impact.oldEMI.toFixed(2)} → $${impact.newEMI.toFixed(2)}`);
    console.log(`Tenure Change: ${impact.tenureChange} months`);
    console.log(`Interest Difference: $${impact.interestDifference.toFixed(2)}`);
  });
}
```

### Loan with EMI Changes

```typescript
import { AdvancedLoanCalculator, LoanCalculationInputs, EMIChange } from 'loanwise';

const loanInputs: LoanCalculationInputs = {
  loanAmount: 100000,
  initialInterestRate: 7.5,
  startDate: '2023-01-01',
  tenureMonths: 120,
  emiChanges: [
    {
      id: 'increase-payment',
      emi: 1300, // Increase EMI to 1300
      startDate: '2024-01-01'
    }
  ]
};

const calculator = new AdvancedLoanCalculator(loanInputs);
const result = calculator.calculate();

// Examine EMI change impacts
if (result.impacts?.emiChangeImpacts) {
  result.impacts.emiChangeImpacts.forEach(impact => {
    console.log(`\nEMI Change ID: ${impact.emiChangeId}`);
    console.log(`EMI: $${impact.oldEMI.toFixed(2)} → $${impact.newEMI.toFixed(2)}`);
    console.log(`Tenure Change: ${impact.tenureChange} months`);
    console.log(`Interest Difference: $${impact.interestDifference.toFixed(2)}`);
  });
}
```

### Combined Scenario

```typescript
import { 
  AdvancedLoanCalculator, 
  LoanCalculationInputs, 
  Prepayment,
  InterestRateChange,
  EMIChange 
} from 'loanwise';

const loanInputs: LoanCalculationInputs = {
  loanAmount: 250000,
  initialInterestRate: 7.5,
  startDate: '2023-01-01',
  tenureMonths: 240, // 20 years
  
  // Add a one-time prepayment
  prepayments: [
    {
      id: 'bonus-prepayment',
      amount: 15000,
      type: 'onetime',
      startDate: '2024-01-15',
      impact: 'tenure'
    }
  ],
  
  // Add an interest rate change
  interestRateChanges: [
    {
      id: 'market-adjustment',
      rate: 8.0,
      effectiveDate: '2025-06-01',
      impact: 'EMI'
    }
  ],
  
  // Add an EMI change
  emiChanges: [
    {
      id: 'payment-increase',
      emi: 2200,
      startDate: '2026-01-01'
    }
  ]
};

const calculator = new AdvancedLoanCalculator(loanInputs);
const result = calculator.calculate();

// Display summary
console.log(`Original Loan: $${loanInputs.loanAmount} at ${loanInputs.initialInterestRate}%`);
console.log(`Original Term: ${loanInputs.tenureMonths} months (${loanInputs.tenureMonths / 12} years)`);
console.log(`Final Term: ${result.summary.totalEMIs} months (${(result.summary.totalEMIs / 12).toFixed(1)} years)`);
console.log(`Total Interest: $${result.summary.totalInterestPayable.toFixed(2)}`);
console.log(`Total Prepayment: $${result.summary.totalPrepayment.toFixed(2)}`);
console.log(`Last Payment Date: ${result.summary.lastPaymentDate}`);

// Access payment schedule (first 3 payments)
console.log('\nInitial Payments:');
result.schedule.slice(0, 3).forEach((payment, index) => {
  console.log(`Payment ${index + 1}: ${payment.date} | EMI: $${payment.emiAmount.toFixed(2)} | Principal: $${payment.principalPaid.toFixed(2)} | Interest: $${payment.interestPaid.toFixed(2)} | Balance: $${payment.remainingBalance.toFixed(2)}`);
});
```

## 9. Best Practices

1. **Date Format**: Always use ISO format (YYYY-MM-DD) for dates
2. **Interest Rate Format**: Provide interest rates as percentages (e.g., 7.5 for 7.5%)
3. **Unique IDs**: Always provide unique IDs for prepayments, interest rate changes, and EMI changes
4. **Error Handling**: Wrap loan calculation code in try-catch blocks to handle potential validation errors
5. **Impact Selection**: Choose impact type carefully based on borrower preference:
   - Choose 'tenure' impact to reduce loan duration while keeping EMI the same
   - Choose 'EMI' impact to reduce monthly payments while keeping duration the same
6. **Validation**: The library automatically validates inputs, but verify critical values before passing them

## 10. Error Handling

The library performs robust validation on all inputs and will throw specific error messages if any validation fails:

- Negative or zero loan amounts
- Negative interest rates
- Non-positive or non-integer tenure values
- Invalid date formats
- Invalid or insufficient EMI amounts
- Invalid prepayment configurations
- Invalid interest rate changes

Example of proper error handling:

```typescript
try {
  const calculator = new AdvancedLoanCalculator(loanInputs);
  const result = calculator.calculate();
  // Process result
} catch (error) {
  console.error("Loan calculation error:", error.message);
  // Handle error appropriately
}
```

## Requirements

- TypeScript 4.0+
- Node.js 14+

## License

ISC