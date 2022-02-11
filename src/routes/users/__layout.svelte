<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { getPageParamsFromUrl } from '$lib/util';

	$: user = new URL($page.url).pathname.split('/').pop();
	$: p = getPageParamsFromUrl(new URL($page.url));
</script>

<div class="text-4xl font-bold py-5 mb-4">
	{decodeURIComponent(user)}
</div>

<nav class="flex border-b relative mb-8">
	<a sveltekit:prefetch href="/user/{user}?page_size={p.page_size}&page={p.page}">Home</a>
	<span class="mx-2">|</span>
	<a
		sveltekit:prefetch
		href="/users/{user}/about?page_size={p.page_size}&page={p.page}"
		class="active">About</a
	>
</nav>

<slot />

<style>
	a,
	span {
		@apply text-gray-400 py-4;
	}

	.active {
		@apply text-black border-b border-black;
	}
</style>
