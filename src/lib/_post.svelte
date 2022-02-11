<script>
	import 'github-markdown-css/github-markdown-light.css';
	import 'prism-themes/themes/prism-vsc-dark-plus.min.css';
	import { showTitle } from '$lib/store';
	import { onDestroy, onMount } from 'svelte';

	export let title;

	let observer;
	let wrap;
	let content;

	onMount(() => {
		const links = [...content.querySelectorAll('a')];
		links.forEach((link) => {
			link.target = '__blank';
			link.style.textDecoration = 'underline';
		});

		if (!wrap) return;
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				$showTitle = entry.isIntersecting ? '' : title;
			});
		});

		observer.observe(wrap);
	});

	onDestroy(() => {
		if (observer) {
			observer?.disconnect();
		}
		$showTitle = '';
	});
</script>

<div>
	{#if title}
		<h1 bind:this={wrap} class="py-4 mb-2 mt-8">
			<span class="font-semibold text-2xl">{title}</span>
		</h1>
	{/if}
	<div bind:this={content} class="content markdown-body">
		<slot />
	</div>
</div>
