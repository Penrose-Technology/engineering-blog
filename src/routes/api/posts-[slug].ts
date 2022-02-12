import { getPosts } from '$lib/post';
import { create } from '$lib/create_time/create';
import { paged } from '$lib/util';

export const get = async ({ params }) => {
	let body = await getPosts();

	let times;
	// @ts-ignore
	if (import.meta.env.DEV) {
		times = create(body.files);
	} else {
		const data = await import('../../../static/.post_time.json');
		times = data.default;
	}

	const args = JSON.parse(params.slug);
	const { name, user, category, tag, detail, list, page, page_size, meta } = args;

	delete body.files;

	if (detail) {
		delete body.total;

		const time_key = [user, name].join('/');
		const time = times[time_key];

		const post = body.list.find((item) => item.u === user);

		return {
			body: {
				...body,
				post,
				time
			}
		};
	}

	if (list) {
		if (list === 'category') {
			// filter
			body.list = body.list.filter((item) => item.category.includes(category));
		} else if (list === 'tags') {
			// filter
			body.list = body.list.filter((item) => item.tags.includes(tag));
		} else if (list === 'user') {
			// filter
			body.list = body.list.filter((item) => item.u === user);
		}

		if (list !== 'all') {
			body.total = body.list.length;
		}

		// pagin
		body.list = paged(
			body.list
				.map((item) => {
					const { hash, ...others } = times[item.id];
					return {
						...item,
						...others
					};
				})
				.sort((a, b) => b.updated_at - a.updated_at),
			{ page, page_size }
		);

		return {
			body
		};
	} else if (meta) {
		const { categorys, tags } = body.list.reduce(
			(prev, cur) => {
				if (cur.category) {
					for (const cate of cur.category) {
						if (!prev.categorys.includes(cate)) {
							prev.categorys = [...prev.categorys, cate];
						}
					}
				}

				if (cur.tags) {
					for (const tag of cur.tags) {
						if (!prev.tags.includes(tag)) {
							prev.tags = [...prev.tags, tag];
						}
					}
				}

				return { ...prev };
			},
			{ categorys: [], tags: [] }
		);

		return {
			body: {
				categorys,
				tags
			}
		};
	}
};
