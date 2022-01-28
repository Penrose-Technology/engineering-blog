<script context="module">
	export const load = async ({ fetch, url }) => {
		const _url = new URL(url);
		const page = _url.searchParams.get('page') ?? 1;
		const page_size = _url.searchParams.get('page_size') ?? 2;
		const author = /^\/blog\/(.*)\/?$/.exec(_url.pathname)[1];
		const posts = await fetch(`/api/${author}-${page}-${page_size}.json`);
		const { list, total } = await posts.json();

		return {
			props: {
				posts: list,
				total: +total,
				page: +page,
				page_size: +page_size
			}
		};
	};
</script>

<script lang="ts">
	import Blogs from '$lib/blogs.svelte';

	export let posts: any[];
	export let page: number;
	export let page_size: number;
	export let total: number;
</script>

<Blogs {posts} {page} {page_size} {total} />
