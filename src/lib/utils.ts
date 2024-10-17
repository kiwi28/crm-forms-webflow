export function formatDateForRomania(dateString: string): string {
	// Create a date object from the input string
	const date = new Date(dateString);

	// Create an options object for formatting
	const options = {
		timeZone: "Europe/Bucharest",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	};

	// Format the date
	const formattedDate = date.toLocaleString("ro-RO", options);

	// Split the formatted string into date and time
	const [dateFormatted, timeFormatted] = formattedDate.split(", ");

	// Rearrange the date parts to dd/mm/yyyy
	const [day, month, year] = dateFormatted.split(".");

	// Combine everything in the desired format
	return `${day}/${month}/${year} ${timeFormatted}`;
}
