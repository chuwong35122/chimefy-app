import sha1 from 'sha1';

export function checkHash(text: string, hashText: string) {
	return hashText === sha1(text);
}

export function hashText(input: string) {
	return sha1(input);
}
