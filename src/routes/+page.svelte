<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import type { PageProps } from "./$types";

	let { data, form }: PageProps = $props();

	const durationOptions = [
		{ duration: 1, unit: "hour" },
		{ duration: 6, unit: "hour" },
		{ duration: 1, unit: "day" },
		{ duration: 3, unit: "day" },
		{ duration: 7, unit: "day" },
	].map((option) => ({
		label: `${option.duration} ${option.unit}${option.duration > 1 ? "s" : ""}`,
		value: JSON.stringify(option),
	}));
</script>

{#if form?.success}
	<div role="alert" class="alert alert-success">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<span>
			Your custom URL has been created!
			<a href={`${page.url.origin}/${form.customUrl}`} class="link link-hover">
				{`${page.url.origin}/${form.customUrl}`}
			</a>
		</span>
	</div>
{:else if form?.message}
	<div role="alert" class="alert alert-error">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<span>Error! {form.message}</span>
	</div>
{/if}

<form
	method="post"
	action="/"
	class="card bg-base-300 flew m-4 w-full min-w-fit flex-col gap-4 p-4 md:w-184"
	use:enhance
>
	<label class="input w-full">
		<span class="label">URL</span>
		<input
			type="url"
			name="url"
			placeholder="Original URL (including https:// or http://)"
			required
		/>
	</label>

	<label class="input w-full">
		<span class="label">{page.url.host}/</span>
		<input type="text" name="customUrl" placeholder="Custom URL" required />
	</label>
	<label class="select w-full">
		<span class="label">Expires after</span>
		<select name="duration">
			{#each durationOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</label>
	<button type="submit" class="btn-primary btn">Create</button>
</form>
