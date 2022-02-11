<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				status
			}
		};
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { getPageParamsFromUrl } from '$lib/util';

	export let status: number;

	$: p = getPageParamsFromUrl(new URL($page.url));
	$: user =
		/^\/users\/.*$/.exec(new URL($page.url).pathname) &&
		new URL($page.url).pathname.split('/').pop();
</script>

{#if user}
	<div class="user-info">
		<div class="text-4xl font-bold py-5 mb-4">
			{decodeURIComponent(user)}
		</div>

		<nav class="flex border-b relative mb-8">
			<a sveltekit:prefetch href="/user/{user}?page_size={p.page_size}&page={p.page}">Home</a>
			<span class="mx-2">|</span>
			<a href="/users/{user}/about?page_size={p.page_size}&page={p.page}" class="active">About</a>
		</nav>

		<div>空空如也~</div>
	</div>
{:else}
	<h1 class="flex items-center justify-center fixed top-14 bottom-0 left-0 right-0">
		{#if status === 404}
			<div class="flex flex-col items-center">
				<i class="iconfont icon-_404 text-8xl" style="color: rgba(0,0,0,.5);" />
				<a
					href="/"
					class="underline text-black hover:text-blue-400"
					on:click={(e) => {
						e.preventDefault();
						history.back();
					}}>返回</a
				>
			</div>
		{/if}
	</h1>
{/if}

<style>
	.user-info a,
	.user-info span {
		@apply text-gray-400 py-4;
	}

	.user-info .active {
		@apply text-black border-b border-black;
	}
</style>
