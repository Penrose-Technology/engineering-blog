<script context="module">
	export const prerender = true;
	import { fetchData } from '$lib/util';

	export const load = async ({ url, fetch }) => {
		const [user, name] = new URL(url).pathname.split('/').slice(-2).map(decodeURIComponent);
		const slug = JSON.stringify({ user, detail: true, name });

		const { users, times } = await fetchData(fetch, `/api/posts-${slug}`);
		const time = times[[user, name].join('/')];

		return {
			props: {
				user,
				...users[user],
				...time
			}
		};
	};
</script>

<script lang="ts">
	import { formatDate } from '$lib/util';

	export let user: string;
	export let avatar: string;
	export let min: number;
	export let updated_at: number;
</script>

<div class="flex items-center">
	<a href="/user/{user}" class="hover:opacity-75 transition-opacity">
		{#if avatar}
			<img src={avatar} class="w-12 h-12 rounded-full" alt="avatar" />
		{:else}
			<div class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
				{user[0].toUpperCase()}
			</div>
		{/if}
	</a>
	<div class="ml-2">
		<a href="/user/{user}" class="hover:underline">{user}</a>
		<div class="flex items-center">
			<span class="text-sm opacity-75">{formatDate(updated_at)}</span>
			<i class="iconfont icon-dot text-xs font-semibold" />
			<span class="text-sm opacity-75">{min} min read</span>
		</div>
	</div>
</div>
<slot />
