<script context="module">
	import { fetchData } from '$lib/util';

	export const load = async ({ fetch }) => {
		const slug = { meta: true };
		const { tags, categorys } = await fetchData(fetch, `/api/posts`, slug);

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
		const isIPhone = /iphone os/i.test(ua);
		const isAndroid = /android/i.test(ua);
		const isIOS = /ipad|iphone|ipod/i.test(ua);
		if (isIPhone || isAndroid) {
			document.body.classList.add('is-mobile');
		}
		if (isIPhone) {
			document.body.classList.add('is-iphone');
		}
		if (isAndroid) {
			document.body.classList.add('is-android');
		}
		if (isIOS) {
			document.body.classList.add('is-ios');
		}

		$env = {
			isIPhone,
			isIOS,
			isAndroid,
			isMobile: isIOS || isAndroid
		};

		if (isIOS) {
			window.document.addEventListener(
				'touchmove',
				(e) => {
					// @ts-ignore
					if (e.scale !== 1) {
						e.preventDefault();
					}
				},
				{ passive: false }
			);
		}
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
