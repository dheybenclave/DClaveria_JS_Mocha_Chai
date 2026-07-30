/**
 * Converts a date input (timestamp or string) into a specified string format.
 * 
 * Supported tokens:
 * - YYYY : 4-digit year (e.g., 2026)
 * - MMMM : Full month name (e.g., July)
 * - MMM  : Short month name (e.g., Jul)
 * - MM   : Padded numeric month (e.g., 07)
 * - DD   : Padded numeric day (e.g., 09, 30)
 * - D    : Raw numeric day (e.g., 9, 30)
 * 
 * @param {number|string} dateInput - The Unix timestamp or date string to format.
 * @param {string} [formatPattern='MMMM D YYYY'] - The layout pattern for the output.
 * @returns {string} The cleanly formatted date string or "Invalid Date".
 */
export function formatDate(dateInput, formatPattern = 'MMMM D YYYY') {
  // Convert input into a native JavaScript Date object
  const dateObj = new Date(dateInput);

  // Return early if the input cannot be securely parsed
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  // Extract core date values
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  // Extract month variations using standard system locale (en-US)
  const monthLong = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const monthNumeric = String(dateObj.getMonth() + 1).padStart(2, '0');

  // Pad the day value to always be two digits (e.g., 5 becomes "05")
  const dayPadded = String(day).padStart(2, '0');

  // Replace tokens hierarchically to avoid partial string corruption
  return formatPattern
    .replace('YYYY', year)
    .replace('MMMM', monthLong)
    .replace('MMM', monthShort)
    .replace('MM', monthNumeric)
    .replace('DD', dayPadded)
    .replace(/\bD\b/g, String(day));
}
