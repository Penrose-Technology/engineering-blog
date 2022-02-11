<script context="module">
	export const prerender = true;

	import { fetchData, getPageParamsFromUrl } from '$lib/util';

	export const load = async ({ fetch, url, params }) => {
		const p = getPageParamsFromUrl(new URL(url));
		const slug = JSON.stringify({
			list: 'category',
			category: params.slug,
			...p
		});

		const data = await fetchData(fetch, `/api/posts-${slug}`);

		return {
			props: data
		};
	};
</script>

<script lang="ts">
	import List from '$lib/list.svelte';
	import Pagin from '$lib/pagin.svelte';
	import type { Post } from '$lib/post';
	import { page } from '$app/stores';

	export let list: Post[];
	export let total: number;
</script>

<div class="text-4xl font-bold py-5 mb-4 border-b">
	{$page.params.slug}
</div>

{#if list}
	<List {list} />
	<Pagin {total} />
{/if}
