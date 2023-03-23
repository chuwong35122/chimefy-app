/**
 * Add leading 0 to a number
 * @param num number to add leading 0
 * @param places how many leading 0 to be added
 */
export function zeroPad(num: number, places: number) {
	return String(num).padStart(places, '0');
}

export function millisecondToMinuteSeconds(ms: number) {
	const minutes = Math.floor(ms / 60000);
	const seconds = parseInt(((ms % 60000) / 1000).toFixed(0));
	return `${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)}`;
}

export function minuteSecondsToTime(minutes: number | undefined, seconds: number | undefined) {
	return `${zeroPad(minutes ?? 0, 2)}:${zeroPad(seconds ?? 0, 2)}`;
}

export function calculatePercentageOfTime(percent: number, minute: number, second: number) {
	const totalSeconds = minute * 60 + second;
	const fraction = Math.floor((totalSeconds * percent) / 100);
	return millisecondToMinuteSeconds(fraction * 1000);
}

export function calculatePercentageFromTime(
	fromSecond: number,
	fromMinute: number,
	toSecond: number,
	toMinute: number
) {
	const fromSeconds = fromMinute * 60 + fromSecond;
	const toSeconds = toMinute * 60 + toSecond;
	return Math.floor(fromSeconds / toSeconds);
}

export function calculateMinutesFromMillisecond(ms: number) {
	const seconds = Math.floor(ms / 1000);
	return Math.floor(seconds / 60);
}

export function calculateSecondsFromMillisecond(ms: number) {
	const minutes = calculateMinutesFromMillisecond(ms);
	const seconds = Math.floor(ms / 1000);
	const remainingSeconds = seconds - minutes * 60;
	return remainingSeconds;
}
