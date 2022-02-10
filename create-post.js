import prompts from 'prompts';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const log = console.log;
const tpl = (title) => `
---
title: ${title}
state: 2
---

This is A Demo.
`;

const props = ['作者', '标题', '文件名'].map(
	(n) => () =>
		prompts({
			type: 'text',
			name: 'value',
			message: n,
			validate: (val) => Boolean(val?.trim())
		})
);

const values = [];

(async () => {
	for (const item of props) {
		const { value } = await item();
		if (!value?.trim()) {
			break;
		}

		values.push(value);
	}

	if (values.length !== 3) return;

	log();
	log(chalk.cyan('   创建中...'));
	const dir = path.resolve(`./src/routes/posts/${values[0]}`);
	const file = path.resolve(dir, `${values[2]}.md`);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	fs.writeFileSync(file, tpl(values[1]), 'utf-8');
	console.clear();
	log();
	log(chalk.cyan('   创建成功.'));
	log();
})();
