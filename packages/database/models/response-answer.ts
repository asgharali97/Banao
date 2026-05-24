import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { formFieldsTable } from "./form-field";
import { responsesTable } from "./response";

export const responseAnswersTable = pgTable("response_answers", {
  id: serial("id").primaryKey(),

  responseId: integer("response_id").references(() => responsesTable.id, {
    onDelete: "cascade",
  }),
  fieldId: integer("field_id")
    .notNull()
    .references(() => formFieldsTable.id, { onDelete: "cascade" }),
  value: text("value").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectResponseAnswer = typeof responseAnswersTable.$inferSelect;
export type InsertResponseAnswer = typeof responseAnswersTable.$inferInsert;
