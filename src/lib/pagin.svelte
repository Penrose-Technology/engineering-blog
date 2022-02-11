<script lang="ts">
	import { page } from '$app/stores';
	import { getPageParamsFromUrl } from './util';
	export let total: number;

	let p: number;
	let page_size: number;
	let pages: number;
	let has_prev: boolean;
	let has_next: boolean;

	$: {
		const params = getPageParamsFromUrl(new URL($page.url));
		p = params.page;
		page_size = params.page_size;
		pages = Math.ceil(total / page_size);
		has_prev = p > 1;
		has_next = p < pages;
	}
</script>

{#if has_prev || has_next}
	<div class="flex items-center flex-1 justify-center py-8">
		{#if p > 1}
			<a sveltekit:prefetch href="?page=1&page_size={page_size}" class="mr-4">
				<i class="iconfont icon-arrow-double-left" />
			</a>
		{/if}
		<a sveltekit:prefetch class:disable={!has_prev} href="?page={p - 1}&page_size={page_size}"
			>Prev</a
		>
		<span class="mx-4">|</span>
		<a sveltekit:prefetch class:disable={!has_next} href="?page={p + 1}&page_size={page_size}"
			>Next</a
		>
		{#if p < pages}
			<a sveltekit:prefetch href="?page={pages}&page_size={page_size}" class="ml-4">
				<i class="iconfont icon-arrow-double-right" />
			</a>
		{/if}
	</div>
{/if}

<style>
	.disable {
		@apply text-gray-400 pointer-events-none;
	}

	a {
		@apply flex items-center;
	}
</style>
