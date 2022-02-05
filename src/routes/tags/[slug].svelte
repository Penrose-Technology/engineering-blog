<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import List from '$lib/list.svelte';
	import type { TagMap } from '$lib/post';

	export let tag_map: TagMap;
	$: list = tag_map[$page.params.slug];
</script>

<List {list} />
