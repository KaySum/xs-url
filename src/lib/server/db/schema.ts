import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const urlMapping = pgTable("url_mapping", {
	id: text("id").primaryKey(),
	url: text("url").notNull(),
	userId: text("user_id"),
	createdAt: timestamp("created_at", { precision: 0 }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 0 }).notNull().defaultNow(),
	expiresAt: timestamp("expires_at", { precision: 0 }),
	useCount: integer("use_count").notNull().default(0),
});

export type UrlMapping = typeof urlMapping.$inferSelect;
