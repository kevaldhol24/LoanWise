/**
 * Lumpsum investment calculation output
 */
export interface LumpsumOutput {
    /** Initial principal amount */
    principal: number;
    /** Total amount after compounding */
    totalAmount: number;
    /** Total interest earned */
    totalInterest: number;

    /** Detailed schedule of investment growth */
    schedule: {
        year: number;
        startAmount: number;
        interest: number;
        endAmount: number;
    }[];
}
