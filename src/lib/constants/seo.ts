import { PUBLIC_SITE_URL } from '$env/static/public';

const seo = {
	twitterCard: 'summary_large_image',
	image: '/images/seo/music-along.avif',
	imageAlt: 'Listen to music together with friends',

	appTitle: 'Listen to Spotify music together with friends',
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
	},
	spaceInvite: {
		// title, url, image alt is dynamic
		description: "Your friend has invited you to join Chimefy's space. Login and listen together!",
		image: '/images/seo/enter-session.avif'
	}
};

export default seo;
