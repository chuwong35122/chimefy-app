import type { MusicQueue } from '$lib/interfaces/session/queue.interface';
import { supabase } from '$lib/supabase/supabase';

export async function sliceQueue(
	queues: MusicQueue[],
	trackTargetId: string,
	queueId: number | string
) {
	const _queues = [...queues];
	const filtered = _queues.filter((q) => q.track_id !== trackTargetId);

	await supabase.from('session_queue').update({ queues: filtered }).eq('id', queueId);
	return filtered;
}
