import { pgTable, varchar, timestamp, text, integer, uniqueIndex, foreignKey, index, boolean, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const project = pgTable("Project", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
}, (table) => [
	uniqueIndex("Project_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const roadmap = pgTable("Roadmap", {
	id: text().primaryKey().notNull(),
	projectId: text().notNull(),
	category: text().notNull(),
	status: text().notNull(),
}, (table) => [
	uniqueIndex("Roadmap_projectId_key").using("btree", table.projectId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "Roadmap_projectId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const roadmapItem = pgTable("RoadmapItem", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	status: text().notNull(),
	label: text().notNull(),
	tags: text().array(),
	description: text().notNull(),
	roadmapId: text().notNull(),
	assignedUserId: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roadmapId],
			foreignColumns: [roadmap.id],
			name: "RoadmapItem_roadmapId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.assignedUserId],
			foreignColumns: [user.id],
			name: "RoadmapItem_assignedUserId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const changelogs = pgTable("Changelogs", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	status: text().notNull(),
	projectId: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "Changelogs_projectId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const comment = pgTable("Comment", {
	id: text().primaryKey().notNull(),
	content: text().notNull(),
	changelogId: text().notNull(),
	userId: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.changelogId],
			foreignColumns: [changelogs.id],
			name: "Comment_changelogId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Comment_userId_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const feedback = pgTable("Feedback", {
	id: text().primaryKey().notNull(),
	content: text().notNull(),
	projectId: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [project.id],
			name: "Feedback_projectId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	name: text().notNull(),
	emailVerified: boolean().default(false).notNull(),
	image: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("user_email_key").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text().notNull(),
}, (table) => [
	uniqueIndex("session_token_key").using("btree", table.token.asc().nullsLast().op("text_ops")),
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text().notNull(),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp({ precision: 3, mode: 'string' }),
	refreshTokenExpiresAt: timestamp({ precision: 3, mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const projectToUser = pgTable("_ProjectToUser", {
	a: text("A").notNull(),
	b: text("B").notNull(),
}, (table) => [
	index().using("btree", table.b.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.a],
			foreignColumns: [project.id],
			name: "_ProjectToUser_A_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.b],
			foreignColumns: [user.id],
			name: "_ProjectToUser_B_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.a, table.b], name: "_ProjectToUser_AB_pkey"}),
]);
