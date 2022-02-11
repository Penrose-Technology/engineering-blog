import { SUMMARY_LEN, WORDS_PER_MIN } from './post.config';
import { parseDocument } from 'htmlparser2';

const noop = () => undefined;

enum PostState {
	DRAFT = 1,
	STABLE = 2
}

type Meta = {
	// date: string;
	title: string;
	state: PostState;
	tags?: string;
	category?: string;
};

export type Post = {
	id: string;
	u: string;
	name: string;
	to: string;
	avatar: string;
	summary: string;
	created_at: number;
	updated_at: number;
	min: number;
} & Meta;

export type TagMap = { [x: string]: { list: Post[]; total: number } };

const createPostId = (to: string) => to.slice(7);

export const getPosts = async (): Promise<{
	list: Post[];
	categorys: string[];
	tags: string[];
	users: Record<string, Record<'avatar', string>>;
	total: number;
	files: string[];
}> => {
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

			const reg = new RegExp(`${u}\\.(?:jpe?g|png|webp|svg)$`);
			let avatar = avatars.find((name) => reg.test(name)) ?? '';

			if (avatar) {
				avatar = reg.exec(avatar)[0];
			}

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
								// if (summary.length >= SUMMARY_LEN) return;
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

	list = list.filter(Boolean);

	if (import.meta.env.PROD) {
		list = list.filter(({ state }) => state === PostState.STABLE);
	}

	list = list.filter(({ title, state }) => Boolean(title && state));

	const { categorys, tags, users } = list.reduce(
		(prev, cur) => {
			if (cur.category) {
				cur.category.forEach((cate) => {
					if (!prev.categorys.includes(cate)) {
						prev.categorys = [...prev.categorys, cate];
					}
				});
			}

			if (cur.tags) {
				cur.tags.forEach((tag) => {
					if (!prev.tags.includes(tag)) {
						prev.tags = [...prev.tags, tag];
					}
				});
			}

			prev.users[cur.u] = {
				...(prev.users[cur.u] ?? {}),
				avatar: cur.avatar,
				min: cur.min
			};

			return { ...prev };
		},
		{ categorys: [], tags: [], users: {} }
	);

	const total = list.length;

	return {
		total,
		list,
		categorys,
		tags,
		users,
		files: Object.keys(ret).map((c) => './src' + c.slice(2))
	};
};
