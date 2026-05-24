import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

import { formsTable } from "./form";

export const rateLimitLogTable = pgTable("rate_limit_log", {
  id: serial("id").primaryKey(),

  ipAddress: varchar("ip_address", { length: 45 }).notNull(),
  formId: integer("form_id")
    .notNull()
    .references(() => formsTable.id, { onDelete: "cascade" }),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
});

export type SelectRateLimitLog = typeof rateLimitLogTable.$inferSelect;
export type InsertRateLimitLog = typeof rateLimitLogTable.$inferInsert;
