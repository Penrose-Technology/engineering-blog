<script lang="ts">
	import type { Post } from '$lib/post';
	import { formatDate } from '$lib/util';
	export let list: Post[];
</script>

{#if list}
	{#each list as { u, avatar, updated_at, to, title, summary, tags, min }}
		<div class="flex flex-col max-w-2xl item">
			<div class="flex items-center py-4">
				<a
					sveltekit:prefetch
					class="user flex flex-initial flex-shrink-0 items-center drop-shadow"
					href="/user/{u}"
				>
					{#if avatar}
						<i
							style="background-image: url({avatar})"
							class="bg-no-repeat bg-cover w-6 h-6 rounded-full"
						/>
					{:else}
						<p
							class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-sm font-semibold"
						>
							{u[0].toUpperCase()}
						</p>
					{/if}
					<span class="ml-2">{u}</span>
				</a>

				<p>
					<i class="iconfont icon-dot text-xs font-semibold" />
					<span class="text-sm opacity-75">{formatDate(updated_at)}</span>
					<i class="iconfont icon-dot text-xs font-semibold" />
					<span class="text-sm opacity-75">{min} min read</span>
				</p>
			</div>
			<a sveltekit:prefetch class="flex flex-col" href={to}>
				<div class="font-semibold pb-2">{title}</div>
				<div class="flex flex-wrap pb-2 -mx-1">
					{#each tags as tag, i}
						<a
							sveltekit:prefetch
							href="/tags/{tag}"
							class:bg-red-300={i === 0}
							class:bg-orange-300={i === 1}
							class:bg-amber-300={i === 2}
							class:bg-lime-300={i === 3}
							class="rounded text-sm px-2 mx-1 hover:opacity-75 transition-opacity">{tag}</a
						>
					{/each}
				</div>
				{@html summary}
			</a>
		</div>
	{/each}
{/if}

<style>
	.item + .item {
		@apply mt-9;
	}

	.user:hover > span {
		@apply underline;
	}
</style>
