<script context="module">
	export const prerender = true;
</script>

<script>
	import { showTitle } from '$lib/store';
	import { onDestroy, onMount } from 'svelte';
	import { formatDate } from './util';

	export let title;
	export let date;

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
	<h1 bind:this={wrap} class="flex justify-center py-4 items-center flex-col mb-2">
		<span class="font-semibold text-2xl">{title}</span>
		<em class="text-sm opacity-70 mt-2">{formatDate(date)}</em>
	</h1>
	<div class="content">
		<slot />
	</div>
</div>
