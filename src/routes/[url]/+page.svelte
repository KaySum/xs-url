<script lang="ts">
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	$effect(() => {
		// Redirect to the original URL
		if (data.url) {
			window.location.href = data.url;
		}
	});
</script>

{#if data.url}
	<div class="text-warning">Haven't been redirected yet?</div>
	<a href={data.url} class="link link-hover link-info">Click here</a>
{:else}
	<div class="text-warning">This custom URL is not being used</div>
	<a href="/" class="btn btn-primary">Claim this URL</a>
{/if}
