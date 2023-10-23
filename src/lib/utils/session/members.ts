import type { SessionMember } from '$lib/types/session/member.interface';

export function orderSpaceMembers(members: SessionMember[]) {
	if (!members) return [];

	return members.sort((a, b) => {
		return a.joined_since > b.joined_since ? 1 : -1;
	});
}
