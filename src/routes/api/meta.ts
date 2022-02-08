import { getPosts } from '$lib/post';

export async function get({ url }) {
	const ret = await getPosts();
	return {
		body: {
			tags: ret.tags,
			categorys: ret.categorys
		}
	};
}
