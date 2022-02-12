<script context="module">
	export const prerender = true;

	import { fetchData, getPageParamsFromUrl } from '$lib/util';

	export const load = async ({ fetch, url }) => {
		const params = getPageParamsFromUrl(new URL(url));
		const slug = { list: 'all', ...params };

		const data = await fetchData(fetch, `/api/posts`, slug);

		return {
			props: data
		};
	};
</script>

<script lang="ts">
	import List from '$lib/list.svelte';
	import Pagin from '$lib/pagin.svelte';
	import type { Post } from '$lib/post';
	export let list: Post[];
	export let total: number;
</script>

<List {list} />

<Pagin {total} />
