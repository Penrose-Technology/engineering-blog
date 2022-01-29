<script>
	import { formatDate } from '../date';
	export let title;
	export let date;
</script>

<div class="text-center py-4">
	<h1 class="text-xl">{title}</h1>
	<em class="text-sm">{formatDate(date)}</em>
</div>

<div class="p-4 content">
	<slot />
</div>

<style>
	h1 {
		font-family: 'RalewayVariable', sans-serif;
		font-weight: 700;
	}

	.content :global(p + p) {
		@apply mt-4;
	}
</style>
