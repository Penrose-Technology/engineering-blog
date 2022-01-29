<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	type Menu = { label?: string; link: string; icon: string };
	const menus = [{ link: '/blog', icon: 'home' }] as Menu[];
	let indicator: HTMLDivElement;
	let observer: IntersectionObserver;
	let showBorder = false;

	onMount(() => {
		observer = new IntersectionObserver(
			(entries: IntersectionObserverEntry[]) => {
				entries.forEach((entry) => {
					showBorder = entry.intersectionRatio < 1;
				});
			},
			{
				rootMargin: '-48px 0px 0px 0px'
			}
		);
		observer.observe(indicator);
	});
	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
</script>

<header class="h-16 sticky top-0 flex items-center px-4" class:has-border={showBorder}>
	<ul class="flex">
		{#each menus as item}
			<li>
				<a href={item.link}>
					{#if item.label}
						{item.label}
					{/if}
					{#if item.icon}
						<i class="iconfont icon-{item.icon} text-2xl" />
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</header>
<div class="indicator" bind:this={indicator} />

<style>
	header {
		backdrop-filter: blur(5px);
		background-color: rgba(255, 255, 255, 0.82);
	}

	.has-border {
		@apply border-b;
	}

	ul li {
		@apply p-2;
	}

	.indicator {
		@apply absolute top-16;
		height: 1px;
		width: 1px;
	}
</style>
