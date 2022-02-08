<script lang="ts">
	import { page } from '$app/stores';
	import { PAGE_FROM, PAGE_SIZE } from '$lib/post.config';

	let url: URL;
	let index = -1;
	let nav: HTMLElement;
	let anchors: HTMLAnchorElement[];
	let anchor_rect = { x: 0, w: 0 };
	let p: number | string;
	let page_size: number | string;
	$: {
		if (nav) {
			url = new URL($page.url);

			p = url.searchParams.get('page') ?? PAGE_FROM;
			page_size = url.searchParams.get('page_size') ?? PAGE_SIZE;

			if (/about\/?$/.test(url.pathname)) {
				index = 1;
			} else {
				index = 0;
			}

			if (!anchors) {
				// @ts-ignore
				anchors = [...nav.querySelectorAll('a')];
			}

			const cur = anchors[index];

			const { width, left } = cur.getBoundingClientRect();
			const { left: p_left } = nav.getBoundingClientRect();

			anchor_rect = {
				x: left - p_left,
				w: width
			};
		}
	}
</script>

<div class="text-4xl font-bold py-5 mb-4">
	{$page.params.slug}
</div>

<nav bind:this={nav} class="flex py-4 border-b relative mb-8">
	<a href="/u/{$page.params.slug}?page_size={page_size}&page={p}" class:active={index === 0}>Home</a
	>
	<span class="mx-2">|</span>
	<a href="/u/{$page.params.slug}/about?page_size={page_size}&page={p}" class:active={index === 1}
		>About</a
	>

	<div
		class="bg-black absolute transform bottom-0 left-0 indicator transition-transform duration-300"
		style="transform: translate3d({anchor_rect.x}px,0,0);width: {anchor_rect.w}px;"
	/>
</nav>

<slot />

<style>
	a,
	span {
		@apply text-gray-400;
	}

	.active {
		@apply text-black;
	}

	.indicator {
		height: 1px;
	}
</style>
