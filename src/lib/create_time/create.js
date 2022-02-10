import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dayjs from 'dayjs';
import isEqual from 'lodash.isequal';

const createPostId = (to) => to.slice(7);

const createFileHash = (file_path) => {
	const fileBuffer = fs.readFileSync(file_path);
	const hashSum = crypto.createHash('sha256');
	hashSum.update(fileBuffer);
	return hashSum.digest('hex');
};

export const create = (files) => {
	const json_path = path.resolve('./static/.post_time.json');

	let json;
	try {
		json = fs.existsSync(json_path) ? JSON.parse(fs.readFileSync(json_path, 'utf-8')) : {};
	} catch (e) {
		json = {};
	}

	const list = files.map((p) => {
		const id = createPostId(p.match(/(\/posts.*)\.md/)[1]);
		const hash = createFileHash(path.resolve(p));
		const t = dayjs().unix();

		if (!json[id]) {
			return {
				id,
				hash,
				updated_at: t,
				created_at: t
			};
		} else {
			const { created_at, updated_at, hash: prev } = json[id];
			return {
				id,
				hash,
				updated_at: hash !== prev ? t : updated_at,
				created_at
			};
		}
	});

	const data = list.reduce((prev, cur) => {
		const { id, ...others } = cur;
		return {
			...prev,
			[id]: others
		};
	}, {});

	if (!isEqual(data, json)) {
		fs.writeFileSync(json_path, JSON.stringify(data), 'utf-8');
	}

	return data;
};
