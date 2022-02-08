<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import List from '$lib/list.svelte';
	import Pagin from '$lib/pagin.svelte';
	import type { Post, TagMap } from '$lib/post';

	export let cate_map: TagMap;
	let list: Post[];
	let total: number;
	$: {
		list = cate_map[$page.params.slug].list;
		total = cate_map[$page.params.slug].total;
	}
</script>

{#if list}
	<List {list} />
	<Pagin {total} />
{/if}
