/**
 * Converts an ISO 8601 date string to a nicely formatted string.
 *
 * @param {string} isoString - The ISO 8601 date string to be formatted.
 * @returns {string} - The nicely formatted date string.
 */
export function formatDateString(isoString: string) {
  // Create a new Date object from the ISO string
  const date = new Date(isoString);

  // Define options for the formatting
  const options = {
    weekday: "long", // Full name of the day
    year: "numeric", // Numeric year
    month: "long", // Full name of the month
    day: "numeric", // Numeric day
    hour: "2-digit", // 2-digit hour
    minute: "2-digit", // 2-digit minute
    second: "2-digit", // 2-digit second
    hour12: true, // 12-hour clock with AM/PM
  };

  // Format the date using toLocaleDateString and toLocaleTimeString
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  // Return the combined formatted date and time string
  return `${formattedDate} at ${formattedTime}`;
}
