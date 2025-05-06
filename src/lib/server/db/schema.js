import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	username: text('username').notNull().unique(),
	password: text('password').notNull()
});

export const diaryEntry = pgTable('diary_entry', {
	id: serial('id').primaryKey(),
	userId: integer('user_id').references(() => user.id).notNull(),
	note: text('note').notNull(),
	stressLevel: integer('stress_level').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const diaryEntryRelations = relations(diaryEntry, ({ one }) => ({
	user: one(user, {
		fields: [diaryEntry.userId],
		references: [user.id],
	}),
}));
