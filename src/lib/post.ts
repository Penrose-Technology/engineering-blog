import { SUMMARY_LEN, WORDS_PER_MIN } from './post.config';
import { parseDocument } from 'htmlparser2';

// for production
let cache: Result;

const noop = () => undefined;
const createAvatarRegex = (u: string) => new RegExp(`${u}\\.(?:jpe?g|png|webp|svg)$`);
const getAvatar = (avatarsPaths: string[], u: string) => {
	const reg = createAvatarRegex(u);
	for (const item of avatarsPaths) {
		const match = reg.exec(item);
		if (match) {
			return match[0];
		}
	}
	return '';
};

type Result = {
	list: Post[];
	total: number;
	files: string[];
};

enum PostState {
	// 草稿
	DRAFT = 1,
	// 可发布
	STABLE = 2
}

type Meta = {
	// 标题
	title: string;
	// 状态
	state: PostState;
	// 标签
	tags?: string;
	// 类别
	category?: string;
};

export type Post = {
	id: string;
	// 用户名
	u: string;
	// 文件名
	name: string;
	// 链接
	to: string;
	// 头像
	avatar: string;
	// 简介
	summary: string;
	created_at: number;
	updated_at: number;
	// read minutes
	min: number;
} & Meta;

const createPostId = (to: string) => to.slice(7);
const createCloneData = (data: Result) => ({
	...data,
	files: [...data.files],
	list: [...data.list]
});

export const getPosts = async (): Promise<{
	list: Post[];
	total: number;
	files: string[];
}> => {
	if (cache) {
		return createCloneData(cache);
	}

	const avatars = Object.keys(import.meta.glob('../../static/avatars/*'));

	const ret = import.meta.glob('../routes/posts/**/*.md') as Record<
		string,
		() => Promise<{ [x: string]: Meta }>
	>;
	const iterablePostFiles = Object.entries(ret);

	let list = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const to = /(\/posts.*)\.md$/.exec(path)[1];
			const [u] = path.split(/\//).slice(-2, -1);
			const name = to.split(/\//).pop();
			const avatar = getAvatar(avatars, u);

			try {
				const { metadata, ...args } = await resolver();

				const content = args.default
					// @ts-ignore
					.render()
					.html.split('<div class="content markdown-body">')[1] as string;

				let all_content = '';

				const apppendSummary = (node: any) => {
					if (node.children) {
						for (let item of node.children) {
							if (item.type === 'text') {
								all_content += item.data;
							} else {
								apppendSummary(item);
							}
						}
					}
				};

				apppendSummary(parseDocument(content));

				const counts = (() => {
					const words = all_content.split(/\s+/);
					let c = 0;
					for (const w of words) {
						if (/[\u4E00-\u9FA5]+/.test(w)) {
							for (const v of w) {
								if (v.trim()) {
									c++;
								}
							}
						} else {
							if (w.trim()) {
								c++;
							}
						}
					}
					return c;
				})();

				const summary =
					all_content.slice(0, SUMMARY_LEN) +
					(all_content.length > SUMMARY_LEN ? '...' : '').replace(/^\s+/m, '');

				const id = createPostId(to);

				return {
					id,
					...metadata,
					tags: metadata.tags?.split(/\s+/) ?? [],
					category: metadata.category?.split(/\s+/) ?? [],
					to,
					u,
					name,
					avatar: avatar && `/avatars/${avatar}`,
					summary,
					min: Math.max(1, Math.ceil(counts / WORDS_PER_MIN))
				};
			} catch (e) {
				//
				return null;
			}
		})
	).catch(noop);

	list = list.filter((item) => Boolean(item?.title && item?.state));

	if (import.meta.env.PROD) {
		list = list.filter(({ state }) => state === PostState.STABLE);
	}

	const total = list.length;

	const result = {
		total,
		list,
		files: Object.keys(ret).map((c) => './src' + c.slice(2))
	};

	if (import.meta.env.PROD) {
		if (!cache) {
			cache = createCloneData(result);
		}
	}

	return result;
};
