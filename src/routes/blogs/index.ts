import { getPosts } from '$lib/post';

export async function get({ url }) {
	const list = await getPosts({ url });
	return {
		body: {
			list
		}
	};
}
