import { getPosts } from '$lib/post';
import { create } from '$lib/create_time/create';

export const get = async () => {
	const body = await getPosts();

	let times;
	// @ts-ignore
	if (import.meta.env.DEV) {
		times = create(body.files);
	} else {
		const data = await import('../../../static/.post_time.json');
		times = data.default;
	}

	return {
		body: {
			...body,
			times
		}
	};
};
