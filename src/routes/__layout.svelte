<script context="module">
	export const load = async ({ fetch }) => {
		const ret = await fetch('/api/posts');
		const { tags, categorys } = await ret.json();
		return {
			stuff: {
				tags,
				categorys
			}
		};
	};
</script>

<script>
	import '../app.css';
	import Head from '$lib/head.svelte';
	import { onMount } from 'svelte';
	import { env } from '$lib/store';

	onMount(() => {
		const ua = window.navigator.userAgent;
		const isIOS = /iphone os/i.test(ua);
		const isAndroid = /android/i.test(ua);
		if (isIOS || isAndroid) {
			document.body.classList.add('is-mobile');
		}
		if (isIOS) {
			document.body.classList.add('is-ios');
		}
		if (isAndroid) {
			document.body.classList.add('is-android');
		}

		$env = {
			isIOS,
			isAndroid,
			isMobile: isIOS || isAndroid
		};
	});
</script>

<Head />
<div class="max-w-5xl w-full m-auto px-4 py-8">
	<slot />
</div>
