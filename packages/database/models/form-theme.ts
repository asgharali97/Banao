import { boolean, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const formThemesTable = pgTable("form_themes", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),

  primaryColor: varchar("primary_color", { length: 20 }),
  backgroundColor: varchar("background_color", { length: 20 }),
  fontFamily: varchar("font_family", { length: 100 }),
  backgroundImage: text("background_image"),
  isDefault: boolean("is_default").default(false),

  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectFormTheme = typeof formThemesTable.$inferSelect;
export type InsertFormTheme = typeof formThemesTable.$inferInsert;
