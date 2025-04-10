import { createUrl } from "$lib/server/db/queries";
import { fail } from "@sveltejs/kit";
import { z } from "zod";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

const urlFormSchema = z.object({
	url: z.string().url().max(2048),
	customUrl: z.string().max(255),
	duration: z.object({
		duration: z.number(),
		unit: z.enum(["hour", "day"]),
	}),
});

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			url: formData.get("url"),
			customUrl: formData.get("customUrl"),
			duration: JSON.parse(formData.get("duration") as string),
		};

		const parsedData = urlFormSchema.safeParse(data);

		if (!parsedData.success) {
			return fail(400, {
				message: parsedData.error.errors[0].message,
			});
		}

		// Calculate expiration date based on duration
		const now = new Date();
		let expiresAt = now;

		if (parsedData.data.duration) {
			const { duration, unit } = parsedData.data.duration;
			if (unit === "hour") {
				expiresAt = new Date(now.getTime() + duration * 60 * 60 * 1000);
			} else if (unit === "day") {
				expiresAt = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
			}
		}

		const urlMap = await createUrl({
			id: parsedData.data.customUrl,
			url: parsedData.data.url,
			expiresAt,
		});

		if (!urlMap) {
			return fail(400, {
				message: `"${parsedData.data.customUrl}" is currently in use`,
			});
		}

		return {
			success: true,
			customUrl: urlMap.id,
			url: urlMap.url,
		};
	},
};
