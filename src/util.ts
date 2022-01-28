type Post = {
	user: string;
	path: string;
	meta: {
		date: string;
		title: string;
	};
};

export const getAllPosts = async (): Promise<Post[]> => {
	const allPostFiles = import.meta.glob('./routes/blog/**/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);
	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const { metadata } = await resolver();
			const [root, user, name] = path.slice(9, -3).split('/');
			return {
				meta: metadata,
				path: '/' + [root, user, name].join('/'),
				user
			};
		})
	);

	const posts = allPosts.sort((a, b) => {
		// @ts-ignore
		return new Date(b.meta.date) - new Date(a.meta.date);
	});

	return posts;
};
