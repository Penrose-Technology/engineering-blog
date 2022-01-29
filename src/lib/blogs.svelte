<script lang="ts">
	import { formatDate } from '../date';
	export let posts: any[];
	export let page: number;
	export let page_size: number;
	export let total: number;

	$: prev_page = page - 1;
	$: next_page = page + 1;
	const pages = Math.ceil(total / page_size);
</script>

<ul class="max-w-4xl">
	{#each posts as post}
		<li class="flex flex-col">
			<div class="flex items-center">
				<i
					class="w-6 h-6 rounded-full bg-gray-300 mr-2 bg-no-repeat bg-cover"
					style="background-image: url({post.avatar})"
				/>
				<div class="flex items-center leading-none">
					<a href="/blog/{post.has_user_page ? post.user : `~${post.user}`}">{post.user}</a>
					<i class="iconfont icon-dot text-sm" />
					<span class="text-gray-500 text-sm">{formatDate(post.meta.date)}</span>
				</div>
			</div>
			<a href={post.path} class="mt-4">
				<h1>{post.meta.title}</h1>
				<div class="text-base">
					{@html post.summary}
				</div>
			</a>
		</li>
	{/each}
</ul>

<div class="flex mt-8 justify-center">
	{#if prev_page > 0}
		<a href="?page={prev_page}&page_size={page_size}">Prev</a>
	{/if}
	{#if prev_page > 0 && next_page <= pages}
		<span class="mx-2">|</span>
	{/if}
	{#if next_page <= pages}
		<a href="?page={next_page}&page_size={page_size}">Next</a>
	{/if}
</div>

<style>
	ul {
		@apply p-5;
	}

	ul li + li {
		@apply mt-4;
	}

	li {
		@apply py-5 border-t border-gray-300;
	}

	h1 {
		@apply text-xl;
		font-family: 'RalewayVariable', sans-serif;
		font-weight: 700;
	}
</style>
