import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import { PAGE_FROM, PAGE_SIZE } from './post.config';

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export const formatDate = (date: number) => {
	let now = dayjs();
	let cur = dayjs(date * 1000);

	// in a week
	if (cur.isBetween(now.subtract(7, 'day'), now.add(1, 'day'))) {
		return cur.fromNow();
	}

	// the current year
	if (cur.year() === now.year()) {
		return cur.format('MMM.D');
	}

	// before the current year
	return cur.format('YYYY.MMM.D');
};

export const parseInt = (n: string) => Number.parseInt(n, 10);

export const paged = (list, { page, page_size }) =>
	list.slice((page - 1) * page_size, (page - 1) * page_size + page_size);

export const getPageParamsFromUrl = (url: URL): { page: number; page_size: number } => {
	try {
		const params = url.searchParams;
		const page = params.get('page');
		const page_size = params.get('page_size');

		return {
			page: page ? parseInt(page) : PAGE_FROM,
			page_size: page_size ? parseInt(page_size) : PAGE_SIZE
		};
	} catch (e) {
		return {
			page: PAGE_FROM,
			page_size: PAGE_SIZE
		};
	}
};

export const getAvatar = (user: string): Promise<string | null> => {
	return new Promise((resolve, reject) => {
		const exts = ['jpeg', 'jpg', 'svg', 'webp', 'png'];

		const getAvatar = (ext: string): Promise<string | null> =>
			new Promise((r) => {
				const img = new Image();
				img.onload = () => r(img.src);
				img.onerror = () => r(null);
				img.src = `/avatars/${user}.${ext}`;
			});

		let cur = 0;
		const next = async () => {
			const ext = exts.pop();
			if (!ext) {
				return reject('');
			}

			const ret = await getAvatar(ext);
			if (ret === null) {
				next();
			} else {
				resolve(ret);
			}
		};

		next();
	});
};

export const fetchData = async (
	fetch: any,
	uri: string,
	slug?: Record<string, string | number | boolean>
) => {
	if (slug) {
		uri = `${uri}-${JSON.stringify(slug)}`;
	}

	const res = await fetch(uri);
	const data = await res.json();
	return data;
};
