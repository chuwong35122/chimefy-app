import { PUBLIC_NODE_ENV } from '$env/static/public';
import type { MusicQueue, MusicSessionQueue } from '$lib/interfaces/session/queue.interface';
import type { MusicSessionRole } from '$lib/interfaces/session/session.interface';
import { playTrack } from '$lib/spotify/player';
import { supabase } from '$lib/supabase/supabase';
import {
	isPlayingStatus,
	playingDurationMs,
	playingInfo,
	playingTrackId
} from '../../stores/session';

/**
 * Update queue from session by removing the track from its target ID.
 * This function is used with forward track function.
 * @param queues
 * @param trackTargetId
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
 * @param queue
 * @param playerId
 * @param accessToken
 */
export async function playSingleTrack(queue: MusicQueue, playerId: string, accessToken: string) {
	if (!queue) return;

	if (PUBLIC_NODE_ENV === 'development') {
		console.log('Playing', queue);
	}

	isPlayingStatus.set(true);
	playingTrackId.set(queue.track_id);
	playingDurationMs.set(0);
	playingInfo.set({ ...queue });
	await playTrack(queue, playerId, 0, accessToken);
}
