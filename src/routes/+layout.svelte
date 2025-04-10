<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<div class="fixed inset-0 flex flex-col items-center justify-center gap-4 p-4">
	<h1 class="text-4xl font-bold">xs-url</h1>
	<h2 class="text-md">A simple URL shortening service.</h2>
	{@render children()}
</div>
