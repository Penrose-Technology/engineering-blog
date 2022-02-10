<script>
	let value = 0;
</script>

<p class="flex items-center">
	<button on:click={() => (value -= 1)}>-</button>
	<span class="mx-2">{value}</span>
	<button on:click={() => (value += 1)}>+</button>
</p>

<style>
	button {
		@apply border border-blue-400 bg-transparent px-4 outline-none appearance-none;
	}
</style>
