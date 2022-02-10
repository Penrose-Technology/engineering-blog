import glob from 'fast-glob';
import { create } from './create.js';

(async () => {
	const files = await glob('./src/routes/posts/**/*.md');
	create(files);
})();
