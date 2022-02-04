import { getPosts } from '$lib/post';

export async function get({ url, params }) {
	const list = await getPosts({ url, user: params.slug });
	return {
		body: {
			list
		}
	};
}
