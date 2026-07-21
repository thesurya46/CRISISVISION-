import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, events, shelters, resources, Event, Shelter, Resource } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== EVENTS ====================

export async function getAllEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(events).orderBy(desc(events.timestamp));
}

export async function getActiveEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(events)
    .where(eq(events.status, 'active'))
    .orderBy(desc(events.timestamp));
}

export async function getHighSeverityEvents(): Promise<Event[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(events)
    .where(sql`${events.severity} IN ('high', 'critical')`)
    .orderBy(desc(events.timestamp));
}

export async function getEventStats() {
  const db = await getDb();
  if (!db) return { activeCount: 0, totalAffected: 0, criticalCount: 0 };

  const result = await db.select({
    activeCount: sql<number>`COUNT(CASE WHEN status = 'active' THEN 1 END)`,
    totalAffected: sql<number>`COALESCE(SUM(affected_count), 0)`,
    criticalCount: sql<number>`COUNT(CASE WHEN severity = 'critical' THEN 1 END)`,
  }).from(events);

  return result[0] || { activeCount: 0, totalAffected: 0, criticalCount: 0 };
}

// ==================== SHELTERS ====================

export async function getAllShelters(): Promise<Shelter[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(shelters);
}

export async function getShelterStats() {
  const db = await getDb();
  if (!db) return { totalCapacity: 0, totalOccupancy: 0, openCount: 0 };

  const result = await db.select({
    totalCapacity: sql<number>`COALESCE(SUM(capacity), 0)`,
    totalOccupancy: sql<number>`COALESCE(SUM(current_occupancy), 0)`,
    openCount: sql<number>`COUNT(CASE WHEN status = 'open' THEN 1 END)`,
  }).from(shelters);

  return result[0] || { totalCapacity: 0, totalOccupancy: 0, openCount: 0 };
}

// ==================== RESOURCES ====================

export async function getAllResources(): Promise<Resource[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(resources);
}

export async function getAvailableResources(): Promise<Resource[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(resources)
    .where(eq(resources.status, 'available'));
}

export async function getResourceStats() {
  const db = await getDb();
  if (!db) return { totalResources: 0, deployedCount: 0, availableCount: 0 };

  const result = await db.select({
    totalResources: sql<number>`COUNT(*)`,
    deployedCount: sql<number>`COUNT(CASE WHEN status = 'deployed' THEN 1 END)`,
    availableCount: sql<number>`COUNT(CASE WHEN status = 'available' THEN 1 END)`,
  }).from(resources);

  return result[0] || { totalResources: 0, deployedCount: 0, availableCount: 0 };
}

// TODO: add more feature queries here as your schema grows.
