import { pgTable, text, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enum定義
export const issueStatusEnum = pgEnum("issue_status", ["open", "in-progress", "resolved"])
export const issuePriorityEnum = pgEnum("issue_priority", ["low", "medium", "high"])

// Meetingsテーブル
export const meetings = pgTable("meetings", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  description: text("description").notNull(),
  notes: text("notes").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// AgendaItemsテーブル
export const agendaItems = pgTable("agenda_items", {
  id: text("id").primaryKey(),
  meetingId: text("meeting_id")
    .notNull()
    .references(() => meetings.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  duration: integer("duration").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Issuesテーブル
export const issues = pgTable("issues", {
  id: text("id").primaryKey(),
  meetingId: text("meeting_id")
    .notNull()
    .references(() => meetings.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  status: issueStatusEnum("status").notNull(),
  priority: issuePriorityEnum("priority").notNull(),
  assignee: text("assignee"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// リレーション定義
export const meetingsRelations = relations(meetings, ({ many }) => ({
  agendaItems: many(agendaItems),
  issues: many(issues),
}))

export const agendaItemsRelations = relations(agendaItems, ({ one }) => ({
  meeting: one(meetings, {
    fields: [agendaItems.meetingId],
    references: [meetings.id],
  }),
}))

export const issuesRelations = relations(issues, ({ one }) => ({
  meeting: one(meetings, {
    fields: [issues.meetingId],
    references: [meetings.id],
  }),
}))

// 型エクスポート
export type Meeting = typeof meetings.$inferSelect
export type NewMeeting = typeof meetings.$inferInsert
export type AgendaItem = typeof agendaItems.$inferSelect
export type NewAgendaItem = typeof agendaItems.$inferInsert
export type Issue = typeof issues.$inferSelect
export type NewIssue = typeof issues.$inferInsert

