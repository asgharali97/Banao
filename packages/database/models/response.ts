import { integer, jsonb, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { formsTable } from "./form";

export const responsesTable = pgTable("responses", {
  id: serial("id").primaryKey(),

  formId: integer("form_id").references(() => formsTable.id, {
    onDelete: "cascade",
  }),
  respondentEmail: varchar("respondent_email", { length: 100 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  submittedAt: timestamp("submitted_at").defaultNow(),
  metadata: jsonb("metadata"),
});

export type SelectResponse = typeof responsesTable.$inferSelect;
export type InsertResponse = typeof responsesTable.$inferInsert;
