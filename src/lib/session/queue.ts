import { PUBLIC_NODE_ENV } from '$env/static/public';
import type { MusicQueue, MusicSessionQueue } from '$lib/interfaces/session/queue.interface';
import type { MusicSessionRole } from '$lib/interfaces/session/session.interface';
import { playTrack } from '$lib/spotify/player';
import { supabase } from '$lib/supabase/supabase';
import { playingDurationMs, playingInfo, playingTrackId } from './session';

/**
 * Update queue from session by removing the track from its target ID.
 * This function is used with forward track function.
 * @param queues
 * @param trackTargetId
 * @param queueId
 * @returns queues
 */
export async function sliceQueue(
	queues: MusicQueue[],
	trackTargetId: string,
	queueId: number | string
): Promise<MusicQueue[]> {
	const _queues = [...queues];
	const filtered = _queues.filter((q) => q.track_id !== trackTargetId);

	await supabase.from('session_queue').update({ queues: filtered }).eq('id', queueId);
	return filtered;
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

	playingTrackId.set(queue.track_id);
	playingDurationMs.set(0);
	playingInfo.set({ ...queue });
	await playTrack(queue, playerId, 0, accessToken);
}

/**
 * Play next track called by Supabase realtime channel
 * @param queue
 * @param role
 * @param playingInfo
 * @param spotifyPlayerId
 * @param accessToken
 */
export async function playNextTrack(
	queue: MusicSessionQueue | null,
	role: MusicSessionRole,
	playingInfo: MusicQueue,
	spotifyPlayerId: string,
	accessToken: string | undefined
) {
	if (!queue || !accessToken) return;

	const queueId = queue?.id;
	const queues = queue?.queues;

	if (role === 'admin' && queueId && queues) {
		const sliced = await sliceQueue(queues, playingInfo?.track_id, queueId);

		if (sliced[0]) {
			await playSingleTrack(sliced[0], spotifyPlayerId, accessToken);

			if (PUBLIC_NODE_ENV === 'development') {
				console.log('Playing + Slice', sliced);
			}
		}
	}
}
