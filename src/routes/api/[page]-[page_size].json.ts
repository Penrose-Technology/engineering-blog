import { getAllPosts } from '../../util';

export const get = async ({ params }) => {
	const { page, page_size } = params;
	const posts = await getAllPosts();

	const list = posts.slice((+page - 1) * +page_size, (+page - 1) * +page_size + +page_size);
	return {
		body: {
			list,
			total: posts.length
		}
	};
};
