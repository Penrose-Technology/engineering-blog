import { getPosts } from '$lib/post';

export async function get({ url }) {
	const ret = await getPosts({ url });
	return {
		body: { list: ret.list, page: ret.page, page_size: ret.page_size, total: ret.total }
	};
}
