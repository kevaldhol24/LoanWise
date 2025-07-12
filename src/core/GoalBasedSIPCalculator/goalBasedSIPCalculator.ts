import { GoalBasedSIPInputs, GoalBasedSIPOutput } from "../../interfaces/GoalBasedSipCalculator";
import { roundToDecimal } from "../../utils/financialUtils";
import { SIPCalculator } from "../SipCalculator";

/**
 * Goal-based SIP Calculator
 * Calculates required monthly SIP and total investment to reach a goal amount
 */
export class GoalBasedSIPCalculator {
    private goalAmount: number;
    private years: number;
    private annualRate: number;

    constructor(inputs: GoalBasedSIPInputs) {
        this.validateInputs(inputs);
        this.goalAmount = inputs.goalAmount;
        this.years = inputs.years;
        this.annualRate = inputs.annualRate;
    }

    /**
     * Validates the goal-based SIP inputs
     */
    private validateInputs(inputs: GoalBasedSIPInputs): void {
        if (inputs.goalAmount <= 0) throw new Error('Goal amount must be positive');
        if (inputs.years <= 0) throw new Error('Years must be positive');
        if (inputs.annualRate < 0) throw new Error('Annual rate must be non-negative');
    }

    /**
     * Calculates required monthly SIP and total investment
     */
    public calculate(): GoalBasedSIPOutput {
        const r = this.annualRate / 100 / 12;
        const n = this.years * 12;
        const denominator = (Math.pow(1 + r, n) - 1) / r;
        const monthlyInvestment = this.goalAmount / denominator;
        const totalInvestment = monthlyInvestment * n;

        const sipCalculator = new SIPCalculator({ annualReturnRate: this.annualRate, durationMonths: n, monthlyInvestment })
        const sipResult = sipCalculator.calculate()

        return {
            goalAmount: this.goalAmount,
            years: this.years,
            annualRate: this.annualRate,
            totalInvestment: roundToDecimal(totalInvestment, 2),
            monthlyInvestment: roundToDecimal(monthlyInvestment, 2),
            schedule: sipResult.yearlyBreakdown,
        };
    }
}
