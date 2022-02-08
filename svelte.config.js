import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';
import { init as initMathJax } from 'mathjax';

const mathJaxPreprocess = ({ extension, extensions }) => {
	return {
		markup: async ({ content, filename }) => {
			const extensionsParts = (extensions || [extension]).map((ext) => ext.split('.').pop());

			if (!extensionsParts.includes(filename.split('.').pop())) return;

			const reg = /(\$\$.*\$\$)/g;

			if (!content.match(reg)) {
				return;
			}

			const MathJax = await initMathJax({
				loader: { load: ['input/tex', 'output/svg'] }
			});
			const code = content.replace(reg, (searchValue, replaceValue) => {
				const svg = MathJax.tex2svg(replaceValue.slice(2, -2), { display: true });
				const html = MathJax.startup.adaptor.outerHTML(svg);
				return searchValue.replace(replaceValue, html);
			});
			return {
				code
			};
		}
	};
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extension: '.md',
			layout: 'src/lib/_post.svelte'
		}),
		mathJaxPreprocess({
			extension: '.md'
		}),
		preprocess({
			// @TODO: 有bug，暂时禁掉
			// 	postcss: true
		})
	],

	kit: {
		adapter: adapter()
	}
};

export default config;
