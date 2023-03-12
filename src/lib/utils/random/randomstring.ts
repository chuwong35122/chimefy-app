export function randomString(len: number) {
	if (len <= 0) throw Error('Random string cannot have length <= 0');

	let result = '';
	const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < len; i++) {
		result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
	}

	return result;
}
