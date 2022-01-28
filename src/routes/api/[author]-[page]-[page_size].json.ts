import { getAllPosts } from '../../util';

export const get = async ({ params }) => {
	const { author, page, page_size } = params;
	const posts = await getAllPosts();
	const user_posts = posts.filter(({ user }) => user === author);

	const list = user_posts.slice((+page - 1) * +page_size, (+page - 1) * +page_size + +page_size);
	return {
		body: {
			list,
			total: user_posts.length
		}
	};
};
