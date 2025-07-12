import { LumpsumInputs, LumpsumOutput } from "../../interfaces/LumpsumSipCalculator";
import { roundToDecimal } from "../../utils/financialUtils";


/**
 * Lumpsum Investment Calculator
 * Calculates future value and interest for a lumpsum investment
 */
export class LumpsumCalculator {
    private principal: number;
    private annualRate: number;
    private years: number;

    constructor(inputs: LumpsumInputs) {
        this.validateInputs(inputs);
        this.principal = inputs.principal;
        this.annualRate = inputs.annualRate;
        this.years = inputs.years;
    }

    /**
     * Validates the lumpsum inputs
     */
    private validateInputs(inputs: LumpsumInputs): void {
        if (inputs.principal < 0) throw new Error('Principal must be non-negative');
        if (inputs.annualRate < 0) throw new Error('Annual rate must be non-negative');
        if (inputs.years <= 0) throw new Error('Years must be positive');
    }

    /**
     * Calculates future value and interest for lumpsum investment
     */
    public calculate(): LumpsumOutput {
        const r = this.annualRate / 100;
        const t = this.years;

        let amount = this.principal
        let schedule: LumpsumOutput["schedule"] = []
        for (let i = 0; i < t; i++) {
            const startAmount = amount;
            const interest = startAmount * r;
            amount += interest;
            const endAmount = amount;
            schedule.push({
                year: i + 1,
                startAmount,
                interest,
                endAmount
            });
        }

        const totalAmount = amount;
        const totalInterest = totalAmount - this.principal;


        return {
            principal: this.principal,
            totalAmount: roundToDecimal(totalAmount, 2),
            totalInterest: roundToDecimal(totalInterest, 2),
            schedule
        };
    }
}
