import path from 'path'
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		}
	},

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md'],
			layout: {
				blog: path.resolve('./src/routes/_post.svelte')
			}
		}),
		preprocess({
			postcss: true
		}),
	],
	extensions: ['.svelte', '.md', '.svx'],
};

export default config;
