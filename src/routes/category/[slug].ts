import { getPosts } from '$lib/post';

export async function get({ url }) {
	const { cate_map } = await getPosts({ url });
	return {
		body: { cate_map }
	};
}
