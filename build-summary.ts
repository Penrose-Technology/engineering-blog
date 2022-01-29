import fs from 'fs';
import fg from 'fast-glob';
import { readArticles } from './src/parse-article';

async function run() {
	const res = await fg(['./src/routes/blog/**/*.md']);
	const routes = res.map((item) => ['.' + item.slice(5)]);
	const data = await readArticles(routes);
	fs.rmSync('./src/summary.json');
	fs.writeFileSync('./src/summary.json', JSON.stringify(data), 'utf-8');
}

run();
