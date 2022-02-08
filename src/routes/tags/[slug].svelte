<script context="module">
	export const prerender = true;

	import { paged, getPageParamsFromUrl } from '$lib/util';

	export const load = async ({ fetch, url, params: { slug } }) => {
		const r1 = await fetch('/api/posts' + new URL(url).search);
		const data = await r1.json();

		const params = getPageParamsFromUrl(new URL(url));
		let list = data.list.filter((item) => item.tags?.includes(slug));
		const total = list.length;

		list = paged(
			list
				.map((item) => {
					const { hash, ...others } = data.times[item.id];
					return {
						...item,
						...others
					};
				})
				.sort((a, b) => b.updated_at - a.updated_at),
			params
		);

		return {
			props: {
				list,
				total,
				...params
			}
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

{#if list}
	<List {list} />
	<Pagin {total} />
{/if}
