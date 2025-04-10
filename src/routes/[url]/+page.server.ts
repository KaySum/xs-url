import { accessUrl } from "$lib/server/db/queries";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
	const url = await accessUrl(params.url).then((res) => res?.url);

	return {
		url,
	};
}) satisfies PageServerLoad;
