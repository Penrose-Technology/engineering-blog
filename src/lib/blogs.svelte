<script lang="ts">
	export let posts: any[];
	export let page: number;
	export let page_size: number;
	export let total: number;

	$: prev_page = page - 1;
	$: next_page = page + 1;
	const pages = Math.ceil(total / page_size);
</script>

<ul>
	{#each posts as post}
		<li>
			<h2>
				<a href={post.path}>
					{post.meta.title}
				</a>
			</h2>
			Published {post.meta.date}, <a href="/blog/~{post.user}">{post.user}</a>
		</li>
	{/each}
</ul>

{#if prev_page > 0}
	<a href="?page={prev_page}&page_size={page_size}">Prev</a>
{/if}

{#if next_page <= pages}
	<a href="?page={next_page}&page_size={page_size}">Next</a>
{/if}
