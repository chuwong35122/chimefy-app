import type { MusicQueue } from '$lib/types/session/queue.interface';
import { playTrack } from '$spotify/player';
import { isPlayingStatus, playingDurationMs, playingInfo, playingTrackId } from '$stores/session';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Update queue from session by removing the track from its target ID.
 * This function is used with forward track function.
 * @param queues
 * @param trackTargetId track to be sliced away
 * @param queueId database queue ID
 * @returns queues with the topmost track removed
 */
export async function sliceQueue(
	supabase: SupabaseClient,
	queues: MusicQueue[],
	queueTargetId: string,
	spaceId: number
): Promise<MusicQueue[]> {
	const _queues = [...queues];
	const filtered = _queues.filter((q) => q.id !== queueTargetId);

	const { data } = await supabase
		.from('space')
		.update({ queues: filtered })
		.eq('id', spaceId)
		.select();

	return (data as any)[0].queues;
}

/**
 * Play the topmost track and remove it from the database.
 * @param queue current queue
 * @param playerId Spotify's player ID
 * @param from starting position
 * @param accessToken Spotify's access token
 */
export async function playSingleTrack(
	queue: MusicQueue,
	playerId: string,
	from: number,
	accessToken: string
) {
	if (!queue) return;

	isPlayingStatus.set(true);
	playingTrackId.set(queue.id);
	playingDurationMs.set(from);
	playingInfo.set({ ...queue });
	await playTrack(queue, playerId, from, accessToken);
}
