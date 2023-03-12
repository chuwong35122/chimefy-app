import sha1 from 'sha1';

export function checkHash(text: string, hashText: string) {
	return hashText === sha1(text);
}
