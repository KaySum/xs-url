import { eq, lt, sql } from "drizzle-orm";
import { db } from ".";
import { urlMapping, type UrlMapping } from "./schema";

// Helper function to clean up expired URLs
async function cleanupExpiredUrls(): Promise<void> {
	const now = new Date();
	await db.delete(urlMapping).where(lt(urlMapping.expiresAt, now));
}

export async function createUrl(data: {
	id: string;
	url: string;
	userId?: string;
	expiresAt?: Date;
}): Promise<UrlMapping | null> {
	// Clean up expired entries first
	await cleanupExpiredUrls();

	// Check if URL with this ID already exists
	const existingUrl = await db
		.select()
		.from(urlMapping)
		.where(eq(urlMapping.id, data.id))
		.then((res) => res[0]);

	// Only create if it doesn't already exist
	if (!existingUrl) {
		const [result] = await db
			.insert(urlMapping)
			.values({
				id: data.id,
				url: data.url,
				userId: data.userId,
				expiresAt: data.expiresAt,
			})
			.returning();

		return result;
	}

	// Return null if URL already exists
	return null;
}

// Update the accessUrl function to use the helper
export async function accessUrl(id: string): Promise<UrlMapping | undefined> {
	// Delete expired entries
	await cleanupExpiredUrls();

	// Increment use count and return the mapping
	const [result] = await db
		.update(urlMapping)
		.set({
			useCount: sql`${urlMapping.useCount} + 1`,
		})
		.where(eq(urlMapping.id, id))
		.returning();

	return result;
}
