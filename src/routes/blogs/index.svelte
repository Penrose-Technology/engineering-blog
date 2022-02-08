<script context="module">
	export const prerender = true;
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
