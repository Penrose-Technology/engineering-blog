import { PAGE_FROM, PAGE_SIZE, SUMMARY_LEN } from './post.config';
import { parseDocument } from 'htmlparser2';

const noop = () => undefined;

enum PostState {
	DRAFT = 1,
	STABLE = 2
}

type Meta = {
	date: string;
	title: string;
	state: PostState;
	tags?: string;
	category?: string;
};

type Params = {
	url?: string;
	user?: string;
};

type Page_Config = {
	page: number;
	page_size: number;
};

export type Post = {
	u: string;
	to: string;
	avatar: string;
	summary: string;
} & Meta;

const parseInt = (n: string) => Number.parseInt(n, 10);

class PageConfig {
	static create(url: string): Page_Config {
		const _url = new URL(url);
		const _params = _url.searchParams;
		const page = _params.get('page');
		const page_size = _params.get('page_size');

		return {
			page: page ? parseInt(page) : PAGE_FROM,
			page_size: page_size ? parseInt(page_size) : PAGE_SIZE
		};
	}
}

export type TagMap = { [x: string]: Post[] };

export const getPosts = async ({ url, user }: Params = {}): Promise<{
	list: Post[];
	categorys: string[];
	tags: string[];
	tag_map: TagMap;
	cate_map: TagMap;
}> => {
	const page_config = url ? PageConfig.create(url) : null;

	const avatars = Object.keys(import.meta.glob('../../static/avatars/*'));

	const ret = import.meta.glob('../routes/posts/**/*.md') as Record<
		string,
		() => Promise<{ [x: string]: Meta }>
	>;
	const iterablePostFiles = Object.entries(ret);

	let list = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const to = /(\/posts.*)\.md$/.exec(path)[1];
			const [u] = path.split(/\//).slice(-2, -1);

			let avatar =
				avatars.find((name) => new RegExp(`${u}\\.jpe?g|\\.png|\\.webp$`).exec(name)) ?? '';

			if (avatar) {
				avatar = new RegExp(`(${u}\\.jpe?g|\\.png|\\.webp)$`).exec(avatar)[1];
			}

			try {
				const { metadata, ...args } = await resolver();

				const content = args.default
					// @ts-ignore
					.render()
					.html.split('<div class="content">')[1] as string;

				let summary = '';
				const list = parseDocument(content);
				for (const item of list?.children) {
					// @ts-ignore
					if (item.name === 'p') {
						// @ts-ignore
						if (item.children?.[0]?.type === 'text') {
							// @ts-ignore
							summary += item.children[0].data;
						}

						if (summary.length >= SUMMARY_LEN) break;
					}
				}

				summary =
					summary.slice(0, SUMMARY_LEN).replace(/\s/g, '') +
					(content.length < SUMMARY_LEN ? '' : '...');

				return {
					...metadata,
					tags: metadata.tags?.split(/\s+/) ?? [],
					category: metadata.category?.split(/\s+/) ?? [],
					to,
					u,
					avatar: avatar && `/avatars/${avatar}`,
					summary
				};
			} catch (e) {
				//
				return null;
			}
		})
	).catch(noop);

	list = list.filter(Boolean);

	if (import.meta.env.PROD) {
		list = list.filter(({ state }) => state === PostState.STABLE);
	}

	list = list.filter(({ title, date, state }) => Boolean(title && date && state));

	const { categorys, tags } = list.reduce(
		(prev, cur) => {
			if (cur.category) {
				cur.category.forEach((cate) => {
					if (!prev.categorys.includes(cate)) {
						prev.categorys = [...prev.categorys, cate];
					}
				});
			}

			if (cur.tags) {
				cur.tags.forEach((tag) => {
					if (!prev.tags.includes(tag)) {
						prev.tags = [...prev.tags, tag];
					}
				});
			}

			return { ...prev };
		},
		{ categorys: [], tags: [] }
	);

	if (user) {
		list = list.filter(({ u }) => u === user);
	}

	list = list
		// @ts-ignore
		.sort((a, b) => new Date(b.date) - new Date(a.date));

	let cate_map = {};
	let tag_map = {};

	if (page_config) {
		tag_map = tags.reduce(
			(prev, cur) => ({
				...prev,
				[cur]: list
					.filter(({ tags: t }) => t.includes(cur))
					.slice(
						(page_config.page - 1) * page_config.page_size,
						(page_config.page - 1) * page_config.page_size + page_config.page_size
					)
			}),
			{}
		);
		cate_map = categorys.reduce(
			(prev, cur) => ({
				...prev,
				[cur]: list
					.filter(({ category: cate }) => cate.includes(cur))
					.slice(
						(page_config.page - 1) * page_config.page_size,
						(page_config.page - 1) * page_config.page_size + page_config.page_size
					)
			}),
			{}
		);
	}

	if (page_config) {
		// pagin
		list = list.slice(
			(page_config.page - 1) * page_config.page_size,
			(page_config.page - 1) * page_config.page_size + page_config.page_size
		);
	}

	return { list, categorys, tags, cate_map, tag_map };
};
