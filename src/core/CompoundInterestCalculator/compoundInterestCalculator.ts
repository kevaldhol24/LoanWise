import { CompoundInterestInputs, CompoundInterestOutput, CompoundInterestScheduleItem } from "../../interfaces/CompoundInterestCalculator";
import { roundToDecimal } from "../../utils/financialUtils";


/**
 * Compound Interest Calculator supporting advanced inputs and accurate results
 */
export class CompoundInterestCalculator {
    private principal: number;
    private annualRate: number;
    private compoundingFrequency: number;
    private years: number;
    private additionalContribution: number;

    constructor(inputs: CompoundInterestInputs) {
        this.validateInputs(inputs);
        this.principal = inputs.principal;
        this.annualRate = inputs.annualRate;
        this.compoundingFrequency = inputs.compoundingFrequency;
        this.years = inputs.years;
        this.additionalContribution = inputs.additionalContribution || 0;
    }

    /**
     * Validates the compound interest inputs
     */
    private validateInputs(inputs: CompoundInterestInputs): void {
        if (inputs.principal < 0) throw new Error('Principal must be non-negative');
        if (inputs.annualRate < 0) throw new Error('Annual rate must be non-negative');
        if (inputs.compoundingFrequency <= 0) throw new Error('Compounding frequency must be positive');
        if (inputs.years <= 0) throw new Error('Years must be positive');
        if (inputs.additionalContribution && inputs.additionalContribution < 0) throw new Error('Additional contribution must be non-negative');
    }

    /**
     * Calculates compound interest and returns detailed output
     */
    public calculate(): CompoundInterestOutput {
        let schedule: CompoundInterestScheduleItem[] = [];
        let amount = this.principal;
        const r = this.annualRate / 100 / 12;
        const n = this.compoundingFrequency;

        const y = this.years;

        for (let i = 0; i < y * 12 / n; i++) {
            const interest = amount * (r * n);
            amount += interest + this.additionalContribution;
            schedule.push({
                period: i + 1,
                amount: roundToDecimal(amount, 2),
                year: Math.floor(i / (12 / n)) + 1,
                interest: roundToDecimal(interest, 2),
                contribution: this.additionalContribution ? roundToDecimal(this.additionalContribution, 2) : 0
            });
        }

        const totalInterest = amount - this.principal - (this.additionalContribution * (y * 12 / n));

        return {
            principal: this.principal,
            totalAmount: roundToDecimal(amount, 2),
            totalInterest,
            schedule
        };
    }
}
