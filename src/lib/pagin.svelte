<script lang="ts">
	import { page } from '$app/stores';
	import { PAGE_FROM, PAGE_SIZE } from './post.config';
	export let total: number;

	let _url: URL;
	let p: number;
	let page_size: number;
	let pages: number;
	let has_prev: boolean;
	let has_next: boolean;

	$: {
		_url = new URL($page.url);
		p = Number.parseInt(String(_url.searchParams.get('page') ?? PAGE_FROM), 10);
		page_size = Number.parseInt(String(_url.searchParams.get('page_size') ?? PAGE_SIZE), 10);
		pages = Math.ceil(total / page_size);
		has_prev = p > 1;
		has_next = p < pages;
	}
</script>

{#if _url && (has_prev || has_next)}
	<div class="flex items-center flex-1 justify-center py-8">
		<a rel="external" class:disable={!has_prev} href="?page={p - 1}&page_size={page_size}">Prev</a>
		<span class="mx-4">|</span>
		<a rel="external" class:disable={!has_next} href="?page={p + 1}&page_size={page_size}">Next</a>
	</div>
{/if}

<style>
	.disable {
		@apply text-gray-400 pointer-events-none;
	}
</style>
