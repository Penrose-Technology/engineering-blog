<script context="module">
	import { fetchData } from '$lib/util';

	export const load = async ({ fetch }) => {
		const slug = JSON.stringify({
			meta: true
		});
		const { tags, categorys } = await fetchData(fetch, `/api/posts-${slug}`);

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
	import 'nprogress/nprogress.css';
	import np from 'nprogress';
	import Head from '$lib/head.svelte';
	import { onMount } from 'svelte';
	import { env } from '$lib/store';
	import { navigating } from '$app/stores';

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

	$: if ($navigating) {
		np?.start();
	} else {
		np?.done();
	}
</script>

<Head />
<div class="max-w-5xl w-full m-auto px-4 py-8">
	<slot />
</div>
