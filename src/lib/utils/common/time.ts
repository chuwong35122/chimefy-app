/**
 * Add leading 0 to a number
 * @param num number to add leading 0
 * @param places how many leading 0 to be added
 */
function zeroPad(num: number, places: number) {
	return String(num).padStart(places, '0');
}

export function millisecondToMinuteSeconds(ms: number) {
	const minutes = Math.floor(ms / 60000);
	const seconds = parseInt(((ms % 60000) / 1000).toFixed(0));
	return { minutes: zeroPad(minutes, 2), seconds: zeroPad(seconds, 2) };
}
