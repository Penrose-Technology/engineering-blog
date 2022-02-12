<script context="module">
	export const prerender = true;
	import { fetchData } from '$lib/util';

	export const load = async ({ url, fetch }) => {
		const [user, name] = new URL(url).pathname.split('/').slice(-2).map(decodeURIComponent);
		const slug = { user, detail: true, name };
		const { post, time } = await fetchData(fetch, '/api/posts', slug);

		return {
			props: {
				post,
				...time
			}
		};
	};
</script>

<script lang="ts">
	import { formatDate } from '$lib/util';
	import type { Post } from '$lib/post';

	export let post: Post;
	export let updated_at: number;
</script>

<div class="flex items-center">
	<a href="/user/{post.u}" class="hover:opacity-75 transition-opacity">
		{#if post.avatar}
			<img src={post.avatar} class="w-12 h-12 rounded-full" alt="avatar" />
		{:else}
			<div class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
				{post.u[0].toUpperCase()}
			</div>
		{/if}
	</a>
	<div class="ml-2">
		<a href="/user/{post.u}" class="hover:underline">{post.u}</a>
		<div class="flex items-center">
			<span class="text-sm opacity-75">{formatDate(updated_at)}</span>
			<i class="iconfont icon-dot text-xs font-semibold" />
			<span class="text-sm opacity-75">{post.min} min read</span>
		</div>
	</div>
</div>
<slot />
