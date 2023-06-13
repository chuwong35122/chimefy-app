import { writable } from 'svelte/store';

export const memberChannelSubscription = writable('');
export const channelSubscriptionDestroyed = writable(false);

export let playerReady = writable(false);
export let playerInitErrorMessage = writable('');
