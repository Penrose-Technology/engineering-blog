<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { menus } from './head.config';
	import { env, showTitle } from './store';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';

	let observer: IntersectionObserver;
	let indicator: HTMLDivElement;
	let showBorder = false;

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					showBorder = !entry.isIntersecting;
				});
			},
			{
				rootMargin: '-19px 0px 0px 0px'
			}
		);

		observer.observe(indicator);
	});

	onDestroy(() => {
		observer?.disconnect();
		clearTimeout(show_cates_timeout);
	});

	let show_cates = false;
	let show_cates_timeout: number;
	const showCates = async () => {
		if (!$env.isMobile) return;
		clearTimeout(show_cates_timeout);
		show_cates = true;

		show_cates_timeout = window.setTimeout(() => {
			const cb = () => {
				window.clearTimeout(show_cates_timeout);
				show_cates = false;
				document.removeEventListener('click', cb);
			};
			document.addEventListener('click', cb);
		}, 0);
	};
</script>

<header class="h-14 flex items-center justify-center" class:border-b={showBorder}>
	<div class="px-4 flex items-center max-w-7xl w-full h-full relative">
		{#each menus as menu}
			<a sveltekit:prefetch href={menu.to}>
				<i class="iconfont icon-{menu.icon} text-2xl" />
			</a>
		{/each}
		<ul class="ml-auto">
			<li class="relative cate cursor-pointer" on:click={showCates}>
				分类
				<ul
					class:show-cates={show_cates}
					class="absolute right-0 invisible opacity-0 bg-white w-36 drop-shadow-md py-4"
				>
					{#each $page.stuff.categorys as cate}
						<li class="flex">
							<a
								sveltekit:prefetch
								class="px-4 py-1 flex-1 hover:bg-gray-100"
								href="/category/{cate}">{cate}</a
							>
						</li>
					{/each}
				</ul>
			</li>
		</ul>
		{#if $showTitle}
			<div
				class="absolute font-semibold left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
				in:fade={{ duration: 200 }}
			>
				{$showTitle}
			</div>
		{/if}
	</div>
</header>
<div style="height: 1px; width: 1px" bind:this={indicator} />

<style>
	header {
		@apply sticky top-0 z-10;
		backdrop-filter: var(--header-filter);
		background-color: var(--header-bg-color);
	}

	:global(body:not(.is-mobile)) .cate:hover ul,
	.show-cates {
		@apply visible opacity-100 transition-opacity duration-200 ease-in-out;
	}
</style>
