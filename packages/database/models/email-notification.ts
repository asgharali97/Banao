import { integer, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { formsTable } from "./form";
import { responsesTable } from "./response";


export const emailNotificationTypeEnum = pgEnum("email_notification_type", [
  "creator_alert",
  "respondent_confirmation",
]);
export const emailNotificationStatusEnum = pgEnum("email_notification_status", [
  "pending",
  "sent",
  "failed",
]);

export const emailNotificationsTable = pgTable("email_notifications", {
  id: serial("id").primaryKey(),

  formId: integer("form_id").references(() => formsTable.id, {
    onDelete: "cascade",
  }),
  responseId: integer("response_id").references(() => responsesTable.id, {
    onDelete: "cascade",
  }),
  recipientEmail: varchar("recipient_email", { length: 100 }).notNull(),
  type: emailNotificationTypeEnum("type").notNull(),
  status: emailNotificationStatusEnum("status").notNull().default("pending"),

  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectEmailNotification = typeof emailNotificationsTable.$inferSelect;
export type InsertEmailNotification = typeof emailNotificationsTable.$inferInsert;
