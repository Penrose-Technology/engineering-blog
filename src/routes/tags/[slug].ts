import { getPosts } from '$lib/post';

export async function get({ url }) {
	const { tag_map } = await getPosts({ url });
	return {
		body: { tag_map }
	};
}
