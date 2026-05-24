import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { formThemesTable } from "./form-theme";
import { usersTable } from "./user";

export const formVisibilityEnum = pgEnum("form_visibility", ["public", "unlisted"]);


export const formsTable = pgTable("forms", {
  id: serial("id").primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 70 }).notNull(),
  description: varchar("description", { length: 400 }),

  visibility: formVisibilityEnum("visibility").default("unlisted"),
  isPublished: boolean("is_published").default(false),
  themeId: integer("theme_id").references(() => formThemesTable.id, {
    onDelete: "set null",
  }),
  customSuccessMessage: text("custom_success_message"),
  expireAt: timestamp("expire_at"),
  responseLimit: integer("response_limit"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;
