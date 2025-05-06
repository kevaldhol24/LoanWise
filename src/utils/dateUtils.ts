/**
 * Utility functions for date operations in loan calculations
 */

/**
 * Adds months to a date
 * @param dateStr Date in ISO format
 * @param months Number of months to add
 * @returns New date in ISO format
 */
export function addMonths(dateStr: string, months: number): string {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
}

/**
 * Gets the difference in months between two dates
 * @param startDateStr Start date in ISO format
 * @param endDateStr End date in ISO format
 * @returns Number of months between the dates
 */
export function getMonthsDifference(startDateStr: string, endDateStr: string): number {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth())
  );
}

/**
 * Checks if a date is before another
 * @param dateStr1 First date in ISO format
 * @param dateStr2 Second date in ISO format
 * @returns True if dateStr1 is before dateStr2
 */
export function isBefore(dateStr1: string, dateStr2: string): boolean {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  return date1 < date2;
}

/**
 * Checks if a date is after another
 * @param dateStr1 First date in ISO format
 * @param dateStr2 Second date in ISO format
 * @returns True if dateStr1 is after dateStr2
 */
export function isAfter(dateStr1: string, dateStr2: string): boolean {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);
  return date1 > date2;
}

/**
 * Checks if a date is between two other dates (inclusive)
 * @param dateToCheck Date to check in ISO format
 * @param startDateStr Start date in ISO format
 * @param endDateStr End date in ISO format
 * @returns True if dateToCheck is between startDateStr and endDateStr (inclusive)
 */
export function isBetween(dateToCheck: string, startDateStr: string, endDateStr: string): boolean {
  const date = new Date(dateToCheck);
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  return date >= startDate && date <= endDate;
}

/**
 * Gets the year from a date
 * @param dateStr Date in ISO format
 * @returns Year
 */
export function getYear(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

/**
 * Gets the month from a date (1-12)
 * @param dateStr Date in ISO format
 * @returns Month (1-12)
 */
export function getMonth(dateStr: string): number {
  return new Date(dateStr).getMonth(); // JavaScript months are 0-11
}

/**
 * Sorts dates from earliest to latest
 * @param dates Array of dates in ISO format
 * @returns Sorted array of dates
 */
export function sortDates(dates: string[]): string[] {
  return [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
}