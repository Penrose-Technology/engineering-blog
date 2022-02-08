<script>
	import 'github-markdown-css/github-markdown-light.css';
	import 'prism-themes/themes/prism-vsc-dark-plus.min.css';
	import { showTitle } from '$lib/store';
	import { onDestroy, onMount } from 'svelte';

	export let title;

	let observer;
	let wrap;

	onMount(() => {
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				$showTitle = entry.isIntersecting ? '' : title;
			});
		});

		observer.observe(wrap);
	});

	onDestroy(() => {
		observer?.disconnect();
		$showTitle = '';
	});
</script>

<div>
	<h1 bind:this={wrap} class="py-4 mb-2 mt-8">
		<span class="font-semibold text-2xl">{title}</span>
	</h1>
	<div class="content markdown-body">
		<slot />
	</div>
</div>
