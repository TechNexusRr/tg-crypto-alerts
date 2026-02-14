import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    chatId: text("chat_id").notNull(),
    username: text("username"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  },
  (table) => [
    uniqueIndex("users_chat_id_idx").on(table.chatId),
  ],
);

export const alerts = sqliteTable(
  "alerts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id),
    type: text("type").notNull(),
    data: text("data", { mode: "json" }).notNull(),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [
    index("alerts_user_active_idx").on(table.userId, table.isActive),
  ],
);

export const alertEvents = sqliteTable(
  "alert_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    alertId: integer("alert_id").notNull().references(() => alerts.id),
    userId: integer("user_id").notNull().references(() => users.id),
    type: text("type").notNull(),
    snapshot: text("snapshot", { mode: "json" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [
    index("alert_events_alert_id_idx").on(table.alertId),
    index("alert_events_user_created_idx").on(table.userId, table.createdAt),
  ],
);
