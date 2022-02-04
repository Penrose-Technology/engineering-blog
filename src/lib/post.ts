export const getPosts = async () => {
	const ret = import.meta.glob('../routes/posts/**/*.md');
	const iterablePostFiles = Object.entries(ret);

	const list = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const to = /(\/posts.*)\.md$/.exec(path)[1];
			const { metadata } = await resolver();
			return { ...metadata, to };
		})
	);

	return list;
};
