import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";


import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type", [
  "TEXT",
  "LONG_TEXT",
  "NUMBER",
  "EMAIL",
  "URL",
  "RADIO",
  "CHECKBOX",
  "SELECT",
  "MULTI_SELECT",
  "DATE",
  "RATING",
  "COLOR",
]);

export const formFieldsTable = pgTable(
  "form_fields",
  {
    id: serial("id").primaryKey(),

    formId: integer("form_id")
      .notNull()
      .references(() => formsTable.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 100 }).notNull(),
    labelKey: varchar("label_key", { length: 100 }).notNull(),
    placeholder: text("placeholder"),
    description: text("description"),
    fieldType: fieldTypeEnum("field_type").notNull(),
    options: jsonb("options"),
    validations: jsonb("validations"),
    isRequired: boolean("is_required").default(false),
    orderIndex: numeric("order_index", {scale: 2}).notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      uniqueFormIdAndIndex: unique().on(table.formId, table.orderIndex),
    };
  },
);

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;
