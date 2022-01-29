export const getAllPosts = async () => {
	const allPostFiles = import.meta.glob('./routes/blog/**/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);
	try {
		const [htmls, allPosts] = await Promise.all([
			import.meta.env.PROD
				? import('./summary.json').then((res) => {
						return res.default;
				  })
				: import('./parse-article').then(({ readArticles }) => readArticles(iterablePostFiles)),
			Promise.all(
				iterablePostFiles.map(async ([path, resolver]) => {
					const { metadata } = await resolver();
					const match = /blog\/(.*)\/(.*)\.md$/.exec(path);
					const root = 'blog';
					const user = match[1];
					const name = match[2];
					return {
						meta: metadata,
						path: '/' + [root, user, name].join('/'),
						user,
						has_user_page: false,
						key: [user, name].join('-'),
						avatar: `/avatars/${user}.jpeg`
					};
				})
			)
		]);

		const posts = allPosts
			.sort((a, b) => {
				// @ts-ignore
				return new Date(b.meta.date) - new Date(a.meta.date);
			})
			.map((item) => ({
				...item,
				...htmls[item.key]
			}));

		type Post = typeof posts[0];

		return posts as Post[];
	} catch (e) {
		console.error(e);
	}
};
