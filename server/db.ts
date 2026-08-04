import { eq, desc, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, events, shelters, resources, notifications, weatherReports, Event, Shelter, Resource, Notification, WeatherReport, InsertEvent, InsertShelter, InsertResource, InsertNotification, InsertWeatherReport } from "../drizzle/schema";
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

// ==================== NOTIFICATIONS ====================

export async function getNotificationsForUser(userId: number): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function getUnreadNotificationCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select({
    count: sql<number>`COUNT(*)`,
  }).from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));

  return result[0]?.count ?? 0;
}

export async function createNotification(
  notification: InsertNotification
): Promise<Notification | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create notification: database not available");
    return undefined;
  }

  const result = await db.insert(notifications).values(notification);
  return {
    ...notification,
    id: Number(result[0].insertId),
    createdAt: new Date(),
    read: notification.read ?? false,
  } as Notification;
}

export async function markNotificationAsRead(userId: number, notificationId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));

  return (result[0].affectedRows ?? 0) > 0;
}

export async function markAllNotificationsAsRead(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));

  return true;
}

// ==================== WEATHER ====================

export async function getWeatherReports(): Promise<WeatherReport[]> {
  const db = await getDb();
  if (!db) return [];
  // Return the most recent report per zone
  const all = await db.select().from(weatherReports).orderBy(desc(weatherReports.createdAt));
  const seen = new Set<string>();
  const latest: WeatherReport[] = [];
  for (const report of all) {
    if (!seen.has(report.zone)) {
      seen.add(report.zone);
      latest.push(report);
    }
  }
  return latest;
}

export async function getWeatherAlerts(): Promise<WeatherReport[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(weatherReports)
    .where(sql`${weatherReports.alert} IS NOT NULL`)
    .orderBy(desc(weatherReports.createdAt));
}

export async function getWeatherTrends(hours = 24): Promise<WeatherReport[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(weatherReports).orderBy(desc(weatherReports.createdAt));
}

export async function createWeatherReport(report: InsertWeatherReport): Promise<WeatherReport | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(weatherReports).values(report);
  return {
    ...report,
    id: Number(result[0].insertId),
    createdAt: new Date(),
  } as WeatherReport;
}

// ==================== ADMIN CRUD - EVENTS ====================

export async function createEvent(event: InsertEvent): Promise<Event | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create event: database not available");
    return undefined;
  }

  const result = await db.insert(events).values(event);
  const [created] = await db.select().from(events).where(eq(events.id, Number(result[0].insertId))).limit(1);
  return created;
}

export async function updateEvent(eventId: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update event: database not available");
    return undefined;
  }

  await db.update(events).set(event).where(eq(events.id, eventId));
  const [updated] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  return updated;
}

export async function deleteEvent(eventId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(events).where(eq(events.id, eventId));
  return (result[0].affectedRows ?? 0) > 0;
}

// ==================== ADMIN CRUD - SHELTERS ====================

export async function createShelter(shelter: InsertShelter): Promise<Shelter | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create shelter: database not available");
    return undefined;
  }

  const result = await db.insert(shelters).values(shelter);
  const [created] = await db.select().from(shelters).where(eq(shelters.id, Number(result[0].insertId))).limit(1);
  return created;
}

export async function updateShelter(shelterId: number, shelter: Partial<InsertShelter>): Promise<Shelter | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update shelter: database not available");
    return undefined;
  }

  await db.update(shelters).set(shelter).where(eq(shelters.id, shelterId));
  const [updated] = await db.select().from(shelters).where(eq(shelters.id, shelterId)).limit(1);
  return updated;
}

export async function deleteShelter(shelterId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(shelters).where(eq(shelters.id, shelterId));
  return (result[0].affectedRows ?? 0) > 0;
}

// ==================== ADMIN CRUD - RESOURCES ====================

export async function createResource(resource: InsertResource): Promise<Resource | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create resource: database not available");
    return undefined;
  }

  const result = await db.insert(resources).values(resource);
  const [created] = await db.select().from(resources).where(eq(resources.id, Number(result[0].insertId))).limit(1);
  return created;
}

export async function updateResource(resourceId: number, resource: Partial<InsertResource>): Promise<Resource | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update resource: database not available");
    return undefined;
  }

  await db.update(resources).set(resource).where(eq(resources.id, resourceId));
  const [updated] = await db.select().from(resources).where(eq(resources.id, resourceId)).limit(1);
  return updated;
}

export async function deleteResource(resourceId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(resources).where(eq(resources.id, resourceId));
  return (result[0].affectedRows ?? 0) > 0;
}

// TODO: add more feature queries here as your schema grows.
