<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import List from '$lib/list.svelte';
	import type { Post } from '$lib/post';
	export let list: Post[];
</script>

<List {list} />
