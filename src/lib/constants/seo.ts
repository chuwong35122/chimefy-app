import { PUBLIC_SITE_URL } from '$env/static/public';

const seo = {
	twitterCard: 'summary_large_image',

	appTitle: 'Listen to Spotify premium together with friends',
	appDescription:
		'Create your own space with unlimited number of members and sync all your Spotify music in real-time',
	appUrl: PUBLIC_SITE_URL,
	space: {
		title: 'Join a Chimefy space',
		description: 'Create or join a space to listen together!',
		url: PUBLIC_SITE_URL + '/space'
	},
	createSpace: {
		title: 'Create a Chimefy space',
		description: 'Create a space to listen together!',
		url: PUBLIC_SITE_URL + '/space/create'
	}
};

export default seo;
