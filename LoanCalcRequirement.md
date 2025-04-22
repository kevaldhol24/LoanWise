# Loan Calculation Library - Requirements Document

## Overview

This TypeScript library will allow developers to compute detailed loan schedules and summaries. It will support dynamic inputs such as prepayments, floating interest rates, and EMI changes, along with clear outputs such as EMI schedules and loan summaries.

## Objectives

- Support floating interest rate loans.
- Support prepayments (monthly or one-time) with configurable impact (EMI or tenure).
- Allow borrowers to change EMI based on affordability.
- Produce accurate amortization schedules.
- Maintain clear, modular, and extensible code architecture.

---

## Input Definitions

### Basic Inputs

- **loanAmount**: Total loan principal.
- **initialInterestRate**: Interest rate at the start of the loan.
- **startDate**: Loan start date (ISO format).
- **tenureMonths**: Number of months for repayment.

### Prepayments Array

Each item includes:

- **id**: Unique identifier.
- **amount**: Prepayment amount.
- **type**: 'monthly' | 'onetime'.
- **startDate**: Date of first/only prepayment.
- **endDate**: Optional end date (defaults to loan end).
- **impact**: 'EMI' | 'tenure'.

### Interest Rate Changes Array

Each item includes:

- **id**: Unique identifier.
- **rate**: New interest rate.
- **effectiveDate**: Date when the rate change takes effect.
- **impact**: 'EMI' | 'tenure'.

### EMI Changes Array

Each item includes:

- **id**: Unique identifier.
- **emi**: New EMI amount.
- **startDate**: Date from which new EMI applies.

---

## Output Definitions

### Summary

- Loan amount
- EMI
- Total interest payable
- Total amount payable
- Last payment date
- Total EMIs
- Total prepayment (if any)
- Remaining months

### EMI Schedule Array

- EMI count
- EMI Year
- EMI month
- EMI amount
- Interest paid
- Principal paid
- Prepayment (if any)
- Remaining Balance
- Principal paid till date
- Total monthly payment (EMI + prepayment)

### Impacts

- Prepayment Impact: TBD structure
- EMI Change Impact: TBD structure
- Interest Change Impact: TBD structure

---

## Rules and Notes

1. In final month, EMI and prepayment should be adjusted to avoid overpayment.
2. In the event of concurrent changes, the order of precedence is:
   - EMI Change
   - Interest Change
   - Prepayment
3. Minimum EMI must be sufficient to at least cover monthly interest + some principal.

---

## Task List

### Task ID: TSK-001

**Title**: Define Input & Output TypeScript Interfaces
**Description**: Create all types and interfaces for basic inputs, prepayments, interest changes, EMI changes, and expected outputs.
**Acceptance Criteria**:

- All required interfaces are defined.
- Validations are handled (e.g., non-negative amounts).
- Reusable across the library.

---

### Task ID: TSK-002

**Title**: Calculate Standard EMI Schedule (No Variants)
**Description**: Implement EMI calculation for standard loans with fixed interest and no prepayment/EMI changes.
**Acceptance Criteria**:

- Accurate amortization schedule.
- Final balance is 0 or near-zero.
- EMI breakdown into interest and principal.

---

### Task ID: TSK-003

**Title**: Integrate Monthly and One-Time Prepayments
**Description**: Add support for prepayments, allowing them to impact either EMI or tenure.
**Acceptance Criteria**:

- Prepayments reflect in monthly schedule.
- Logic varies based on 'impact'.
- Adjust final payment to prevent overpayment.

---

### Task ID: TSK-004

**Title**: Support Floating Interest Rate Changes
**Description**: Implement logic to update interest rate and adjust EMI or tenure accordingly.
**Acceptance Criteria**:

- New interest rates applied on effective date.
- Recalculate EMI/tenure accurately.
- Track interest rate history.

---

### Task ID: TSK-005

**Title**: Handle EMI Changes by Borrower
**Description**: Allow user-defined EMI changes and update schedule accordingly.
**Acceptance Criteria**:

- New EMI is respected from given date.
- Minimum EMI threshold validated.
- Remaining tenure/principal adjusts correctly.

---

### Task ID: TSK-006

**Title**: Handle Conflicting Updates in a Single Month
**Description**: Implement rule-based priority when EMI change, prepayment, and interest rate change occur in the same month.
**Acceptance Criteria**:

- Precedence logic applied: EMI > Interest > Prepayment.
- Accurate results regardless of order in input array.

---

### Task ID: TSK-007

**Title**: Final Month Adjustment Logic
**Description**: Ensure final EMI/prepayment doesn’t overpay and adjusts to exactly finish loan.
**Acceptance Criteria**:

- Principal never goes below zero.
- Final month's values dynamically adjusted.

---

### Task ID: TSK-008

**Title**: Generate EMI Schedule with Impacts Summary
**Description**: Create final EMI schedule array along with breakdown of impact from prepayments, EMI changes, and interest changes.
**Acceptance Criteria**:

- Complete monthly breakdown.
- Separate view of total impact by change type.
- JSON-structured output ready for UI rendering.

---

### Task ID: TSK-009

**Title**: Create Unit Tests for All Variants
**Description**: Add tests for standard EMI, with prepayments, floating rates, and EMI changes.
**Acceptance Criteria**:

- 100% coverage for schedule calculation logic.
- Tests simulate various real-world scenarios.

---

### Task ID: TSK-010

**Title**: Publish as NPM Package
**Description**: Finalize, bundle, and publish the library with TypeScript support.
**Acceptance Criteria**:

- Package.json includes all configs.
- README with usage instructions.
- Published on NPM and installable via `npm i`.
