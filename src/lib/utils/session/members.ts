import type { SpaceMember } from '$lib/types/session/member.interface';

export function orderSpaceMembers(members: SpaceMember[]) {
	if (!members) return [];

	return members.sort((a, b) => {
		return a.joined_since > b.joined_since ? 1 : -1;
	});
}
