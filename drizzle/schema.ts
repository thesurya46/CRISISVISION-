import { int, mysqlEnum, mysqlTable, text, varchar, float, timestamp, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Disaster Events Table
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  type: varchar("type", { length: 255 }).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).notNull(),
  location: text("location").notNull(),
  latitude: float("latitude").notNull(),
  longitude: float("longitude").notNull(),
  affectedCount: int("affected_count").default(0),
  status: varchar("status", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Shelters Table
export const shelters = mysqlTable("shelters", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: text("location").notNull(),
  latitude: float("latitude").notNull(),
  longitude: float("longitude").notNull(),
  capacity: int("capacity").notNull(),
  currentOccupancy: int("current_occupancy").default(0),
  contact: varchar("contact", { length: 255 }),
  status: varchar("status", { length: 255 }).notNull(), // e.g., 'open', 'full', 'closed'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Shelter = typeof shelters.$inferSelect;
export type InsertShelter = typeof shelters.$inferInsert;

// Resources Table
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(), // e.g., 'personnel', 'vehicle', 'medical_supply', 'food'
  quantity: int("quantity").notNull(),
  unit: varchar("unit", { length: 255 }), // e.g., 'units', 'liters', 'packs'
  location: text("location").notNull(),
  latitude: float("latitude").notNull(),
  longitude: float("longitude").notNull(),
  status: varchar("status", { length: 255 }).notNull(), // e.g., 'available', 'deployed', 'depleted'
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

// Notifications Table
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["critical", "warning", "info"]).notNull().default("info"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Weather Reports Table
export const weatherReports = mysqlTable("weatherReports", {
  id: int("id").autoincrement().primaryKey(),
  zone: varchar("zone", { length: 255 }).notNull(),
  temperature: float("temperature").notNull(),
  humidity: int("humidity").notNull(),
  windSpeed: float("windSpeed").notNull(),
  rainfall: float("rainfall").notNull(),
  conditions: varchar("conditions", { length: 255 }).notNull(),
  alert: varchar("alert", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WeatherReport = typeof weatherReports.$inferSelect;
export type InsertWeatherReport = typeof weatherReports.$inferInsert;
