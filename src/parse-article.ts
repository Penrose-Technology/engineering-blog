import fs from 'fs';
import { compile } from 'mdsvex';
import { compile as svelteCompile } from 'svelte/compiler';
import shell from 'shelljs';
import { createHash } from 'crypto';

const mdsvex_opts = {
	extensions: ['.svx', '.md'],
	layout: {
		blog: './src/routes/_post.svelte'
	}
};

const SUMMARY_LEN = 200;

// get svelte component html content
const getHTML = (compiled: any, len: number) => {
	const { stdout } = shell.exec(
		`echo '${compiled.js.code}' | ${'./node_modules/.bin/rollup'} -p @rollup/plugin-node-resolve`,
		{
			silent: true
		}
	);

	const { code } = {
		code: stdout.replace(/(export.*$)/m, '') + 'Component.render().html;'
	};

	const str = (0, eval)(code);
	return str;
};

const hash = (buffer: Buffer) => {
	const hashSum = createHash('sha256');
	hashSum.update(buffer);
	return hashSum.digest('hex');
};

const hashMap = new Map<string, { hex: string; summary: string; len: number }>();

export const readArticle = async (
	route: string
): Promise<{ [x: string]: { summary: string; len: number } }> => {
	return new Promise((resolve, reject) => {
		const resolvedPath = ['./src', route.slice(1)].join('');
		const [_, user, name] = /blog\/(.*)\/(.*)\.md$/.exec(route);
		const key = [user, name].join('-');
		if (!fs.existsSync(resolvedPath)) {
			return reject(new Error(`file: ${resolvedPath} not found.`));
		}

		fs.readFile(resolvedPath, async (err, buffer) => {
			const hex = hash(buffer);
			if (hashMap.has(resolvedPath)) {
				const { hex: p_hex, summary, len } = hashMap.get(resolvedPath);

				if (p_hex === hex) {
					return resolve({ [key]: { summary, len } });
				}
			}

			const str = buffer.toString('utf-8');

			try {
				if (err) throw err;
				const preprocessed = await compile(str, mdsvex_opts);
				const compiled = svelteCompile(preprocessed.code, {
					generate: 'ssr'
				});

				const html = getHTML(compiled, SUMMARY_LEN);

				const l = html.length;

				const summary =
					html.slice(0, SUMMARY_LEN).replace(/\s/g, '') + (SUMMARY_LEN < l ? '...' : '');

				hashMap.set(resolvedPath, {
					summary,
					hex,
					len: l
				});

				resolve({ [key]: { summary, len: l } });
			} catch (e) {
				reject(e);
			}
		});
	});
};

export const readArticles = (list: any[]) => {
	return Promise.all(list.map((item) => readArticle(item[0]))).then((list) => {
		return list.reduce(
			(prev, cur) => ({
				...prev,
				...cur
			}),
			{}
		);
	});
};
