<script context="module">
	export const prerender = true;

	export const load = async ({ url, fetch }) => {
		const [user, name] = new URL(url).pathname.split('/').slice(-2).map(decodeURIComponent);
		const r1 = await fetch('/api/posts');
		const { users, times } = await r1.json();

		const { avatar } = users[user];
		const time = times[[user, name].join('/')];

		return {
			props: {
				user,
				avatar,
				...time
			}
		};
	};
</script>

<script lang="ts">
	import { formatDate } from '$lib/util';

	export let user: string;
	export let avatar: string;
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
		<div class="text-sm opacity-60 mt-1">{formatDate(updated_at)}</div>
	</div>
</div>
<slot />
