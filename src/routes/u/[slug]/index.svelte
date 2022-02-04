<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	export let list: any[];
</script>

{#each list as item}
	<div>
		<a href={item.to}>{item.title}</a>
	</div>
{/each}
