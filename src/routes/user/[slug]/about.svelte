<script context="module">
	export const load = async ({ url, params: { slug } }) => {
		return {
			status: 302,
			redirect: `/users/${slug}${new URL(url).search}`
		};
	};
</script>

<div class="py-4">
	<div>About</div>
</div>
