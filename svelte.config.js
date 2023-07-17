// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			edge: false,
			split: true
		}),
		alias: {
			$components: 'src/lib/components',
			$constants: 'src/lib/constants',
			$interfaces: 'src/lib/interfaces',
			$schemas: 'src/lib/schemas',
			$utils: 'src/lib/utils',
			$spotify: 'src/lib/spotify',
			$supabase: 'src/lib/supabase',
			$stores: 'src/lib/stores',
			$assets: 'src/lib/assets',
			$styles: 'src/styles'
		}
	},
	preprocess: vitePreprocess()
};

export default config;
