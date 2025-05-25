import {
    InvestmentFrequency,
    SIPCalculatorInputs,
    SIPCalculationResult,
    SIPYearlyBreakdown
} from '../../interfaces/SipCalculator';

/**
 * SIP (Systematic Investment Plan) calculator class
 * Handles calculation of SIP investments with various options like step-up, inflation adjustment
 * and different investment frequencies
 */
export class SIPCalculator {
    private monthlyInvestment: number;
    private annualReturnRate: number;
    private durationMonths: number;
    private stepUpRate: number;
    private inflationRate: number;
    private investmentFrequency: InvestmentFrequency;

    /**
     * Constructor for SIPCalculator
     * @param inputs SIP calculator inputs
     */
    constructor(inputs: SIPCalculatorInputs) {
        this.validateInputs(inputs);

        this.monthlyInvestment = inputs.monthlyInvestment;
        this.annualReturnRate = inputs.annualReturnRate;
        this.durationMonths = inputs.durationMonths;
        this.stepUpRate = inputs.stepUpRate || 0;
        this.inflationRate = inputs.inflationRate || 0;
        this.investmentFrequency = inputs.investmentFrequency || InvestmentFrequency.MONTHLY;
    }

    /**
     * Validates the SIP calculator inputs
     * @param inputs SIP calculator inputs
     * @throws Error if inputs are invalid
     */
    private validateInputs(inputs: SIPCalculatorInputs): void {
        if (inputs.monthlyInvestment <= 0) {
            throw new Error('Monthly investment amount must be greater than zero');
        }

        if (inputs.durationMonths <= 0) {
            throw new Error('Investment duration must be greater than zero');
        }

        if (inputs.stepUpRate && inputs.stepUpRate < 0) {
            throw new Error('Step-up rate cannot be negative');
        }

        if (inputs.inflationRate && inputs.inflationRate < 0) {
            throw new Error('Inflation rate cannot be negative');
        }
    }

    /**
     * Returns the monthly investment interval based on the investment frequency
     * @returns Number of months between investments
     */
    private getMonthlyInvestmentForFrequency(): number {
        switch (this.investmentFrequency) {
            case InvestmentFrequency.QUARTERLY:
                return 3;
            case InvestmentFrequency.HALF_YEARLY:
                return 6;
            case InvestmentFrequency.YEARLY:
                return 12;
            default:
                return 0;
        }
    }

    /**
     * Calculates the SIP maturity amount, total invested amount, and yearly breakdown
     * @returns SIPCalculationResult containing maturity amount, total invested amount, and yearly breakdown
     */
    calculate(): SIPCalculationResult {
        const { maturityAmount, totalInvestedAmount, yearlyBreakdown } = this.calculateSIP();

        const realValue = maturityAmount / ((1 + this.inflationRate / 100) ** (this.durationMonths / 12));

        return {
            maturityAmount,
            totalInvestedAmount,
            inflationAdjustedMaturityAmount: realValue,
            wealthGain: maturityAmount - totalInvestedAmount,
            yearlyBreakdown,
            inflationAdjustedWealthGain: realValue - totalInvestedAmount,
        }
    }

    /**
     * Internal method to calculate SIP maturity amount and breakdown
     * @param durationMonths Duration in months (default is the instance's duration)
     * @returns Object containing maturity amount, total invested amount, and yearly breakdown
     */
    private calculateSIP(durationMonths = this.durationMonths): {
        maturityAmount: number,
        totalInvestedAmount: number,
        yearlyBreakdown: SIPYearlyBreakdown[]
    } {
        let maturityAmount = 0;
        let totalInvestedAmount = 0;
        const monthlyReturnRate = this.annualReturnRate / 12 / 100;
        const skipInvestmentInterval = this.getMonthlyInvestmentForFrequency();

        const yearlyBreakdown: SIPYearlyBreakdown[] = [];
        let monthlyInvestment = this.monthlyInvestment;

        for (let i = 1; i <= durationMonths; i++) {
            let investment = this.monthlyInvestment;

            if (skipInvestmentInterval !== 0 && i % skipInvestmentInterval !== 1) {
                investment = 0;
            }

            // Apply step-up rate annually
            if (this.stepUpRate && i > 1 && i % 12 === 1) {
                monthlyInvestment *= (1 + this.stepUpRate / 100);
                investment = monthlyInvestment;
            }

            totalInvestedAmount += investment;
            maturityAmount = (maturityAmount + investment) * (1 + monthlyReturnRate);

            // At the end of each year or final month
            if (i % 12 === 0 || i === durationMonths) {
                const year = Math.ceil(i / 12);
                const realValue = maturityAmount / ((1 + this.inflationRate / 100) ** (i / 12));

                yearlyBreakdown.push({
                    year,
                    yearEndMaturity: maturityAmount,
                    inflationAdjustedYearEndMaturity: realValue,
                    yearlyInvestment: totalInvestedAmount,
                    yearlyInterest: maturityAmount - totalInvestedAmount,
                    inflationAdjustedYearlyInterest: realValue - totalInvestedAmount,
                });
            }
        }

        return { maturityAmount, totalInvestedAmount, yearlyBreakdown };
    }
}
