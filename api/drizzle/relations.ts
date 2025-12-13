import { relations } from "drizzle-orm/relations";
import { project, roadmap, roadmapItem, user, changelogs, comment, feedback, session, account, projectToUser } from "./schema";

export const roadmapRelations = relations(roadmap, ({one, many}) => ({
	project: one(project, {
		fields: [roadmap.projectId],
		references: [project.id]
	}),
	roadmapItems: many(roadmapItem),
}));

export const projectRelations = relations(project, ({many}) => ({
	roadmaps: many(roadmap),
	changelogs: many(changelogs),
	feedbacks: many(feedback),
	projectToUsers: many(projectToUser),
}));

export const roadmapItemRelations = relations(roadmapItem, ({one}) => ({
	roadmap: one(roadmap, {
		fields: [roadmapItem.roadmapId],
		references: [roadmap.id]
	}),
	user: one(user, {
		fields: [roadmapItem.assignedUserId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	roadmapItems: many(roadmapItem),
	comments: many(comment),
	sessions: many(session),
	accounts: many(account),
	projectToUsers: many(projectToUser),
}));

export const changelogsRelations = relations(changelogs, ({one, many}) => ({
	project: one(project, {
		fields: [changelogs.projectId],
		references: [project.id]
	}),
	comments: many(comment),
}));

export const commentRelations = relations(comment, ({one}) => ({
	changelog: one(changelogs, {
		fields: [comment.changelogId],
		references: [changelogs.id]
	}),
	user: one(user, {
		fields: [comment.userId],
		references: [user.id]
	}),
}));

export const feedbackRelations = relations(feedback, ({one}) => ({
	project: one(project, {
		fields: [feedback.projectId],
		references: [project.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const projectToUserRelations = relations(projectToUser, ({one}) => ({
	project: one(project, {
		fields: [projectToUser.a],
		references: [project.id]
	}),
	user: one(user, {
		fields: [projectToUser.b],
		references: [user.id]
	}),
}));