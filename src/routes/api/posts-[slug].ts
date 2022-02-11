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
		delete body.categorys;
		delete body.tags;
		delete body.total;
		delete body.list;

		const time_key = [user, name].join('/');
		times = { [time_key]: times[time_key] };
		body.users = { [user]: body.users[user] };

		return {
			body: {
				...body,
				times
			}
		};
	}

	if (list) {
		delete body.categorys;
		delete body.tags;
		delete body.users;

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
		const { categorys, tags } = body;
		return {
			body: {
				categorys,
				tags
			}
		};
	}
};
