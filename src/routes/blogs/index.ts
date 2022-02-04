import { getPosts } from '$lib/post';

export async function get() {
	const list = await getPosts();
	return {
		body: {
			list
		}
	};
}
