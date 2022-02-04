import { PAGE_FROM, PAGE_SIZE } from './post.config';

type Params = {
	url: string;
	user: string;
};

type Page_Config = {
	page: number;
	page_size: number;
};

class PageConfig {
	static create(url: string): Page_Config {
		const _url = new URL(url);
		const page = Number.parseInt(String(_url.searchParams.get('page') ?? PAGE_FROM), 10);
		const page_size = Number.parseInt(String(_url.searchParams.get('page_size') ?? PAGE_SIZE), 10);
		return { page, page_size };
	}
}

export const getPosts = async ({ url, user }: Params) => {
	const page_config = PageConfig.create(url);
	const ret = import.meta.glob('../routes/posts/**/*.md');
	const iterablePostFiles = Object.entries(ret);

	let list = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const to = /(\/posts.*)\.md$/.exec(path)[1];
			const [u] = path.split(/\//).slice(-2, -1);
			const { metadata } = await resolver();
			return { ...metadata, to, u };
		})
	);

	if (user) {
		list = list.filter(({ u }) => u === user);
	}

	list = list
		// @ts-ignore
		.sort((a, b) => new Date(b.date) - new Date(a.date))
		// pagin
		.slice(
			(page_config.page - 1) * page_config.page_size,
			(page_config.page - 1) * page_config.page_size + page_config.page_size
		);

	return list;
};
