import { SwpInputs, SwpOutput, SwpScheduleItem } from "../../interfaces/SwpCalculator";
import { roundToDecimal } from "../../utils/financialUtils";


/**
 * Compound Interest Calculator supporting advanced inputs and accurate results
 */
export class SwpCalculator {
    private principal: number;
    private annualRate: number;
    private years: number;
    private monthlyWithDrawal: number;

    constructor(inputs: SwpInputs) {
        this.validateInputs(inputs);
        this.principal = inputs.principal;
        this.annualRate = inputs.annualRate;
        this.years = inputs.years;
        this.monthlyWithDrawal = inputs.monthlyWithDrawal || 0;
    }

    /**
     * Validates the compound interest inputs
     */
    private validateInputs(inputs: SwpInputs): void {
        if (inputs.principal < 0) throw new Error('Principal must be non-negative');
        if (inputs.annualRate < 0) throw new Error('Annual rate must be non-negative');
        if (inputs.years <= 0) throw new Error('Years must be positive');
        if (inputs.monthlyWithDrawal && inputs.monthlyWithDrawal < 0) throw new Error('Monthly withdrawal must be non-negative');
    }

    /**
     * Calculates compound interest and returns detailed output
     */
    public calculate(): SwpOutput {
        let schedule: SwpScheduleItem[] = [];
        let amount = this.principal;
        const r = this.annualRate / 100 / 12;

        const y = this.years;

        let totalInterest = 0;
        for (let i = 0; i < y * 12; i++) {
            if( this.monthlyWithDrawal > 0 && amount <= this.monthlyWithDrawal) {
                const withdrawal = amount;
                amount = 0;
                schedule.push({
                    startingAmount: roundToDecimal(withdrawal, 2),
                    closingAmount: roundToDecimal(amount, 2),
                    year: Math.floor(i / 12) + 1,
                    month: (i % 12) + 1,
                    withdrawal: withdrawal,
                    interest: 0,
                });
                break;
            }
            amount -= this.monthlyWithDrawal;
            const interest = amount * (r);
            amount += interest;
            totalInterest += interest;
            schedule.push({
                startingAmount: roundToDecimal(amount - interest + this.monthlyWithDrawal, 2),
                closingAmount: roundToDecimal(amount, 2),
                year: Math.floor(i / 12) + 1,
                month: (i % 12) + 1,
                withdrawal: this.monthlyWithDrawal,
                interest: roundToDecimal(interest, 2),
            });
        }

        return {
            principal: this.principal,
            totalWithdrawals: roundToDecimal(this.monthlyWithDrawal * (y * 12), 2),
            totalAmount: roundToDecimal(amount, 2),
            totalInterest,
            schedule
        };
    }
}
