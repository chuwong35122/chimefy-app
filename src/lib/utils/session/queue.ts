import type { MusicQueue } from '$interfaces/session/queue.interface';
import { playTrack } from '$spotify/player';
import { supabase } from '$supabase/supabase';
import { isPlayingStatus, playingDurationMs, playingInfo, playingTrackId } from '$stores/session';

/**
 * Update queue from session by removing the track from its target ID.
 * This function is used with forward track function.
 * @param queues
 * @param trackTargetId track to be sliced away
 * @param queueId database queue ID
 * @returns queues with the topmost track removed
 */
export async function sliceQueue(
	queues: MusicQueue[],
	trackTargetId: string,
	queueId: number | string
): Promise<MusicQueue[]> {
	const _queues = [...queues];
	const filtered = _queues.filter((q) => q.track_id !== trackTargetId);

	const { data } = await supabase
		.from('session_queue')
		.update({ queues: filtered })
		.eq('id', queueId)
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
	playingTrackId.set(queue.track_id);
	playingDurationMs.set(from);
	playingInfo.set({ ...queue });
	await playTrack(queue, playerId, from, accessToken);
}
