import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import * as schema from "./schema";

async function seed() {
  const connection = await createPool(process.env.DATABASE_URL);
  const db = drizzle(connection, { schema, mode: "default" });

  console.log("Seeding database...");

  // Seed Users
  await db.insert(schema.users).values([
    {
      openId: "owner123",
      name: "Platform Owner",
      email: "owner@example.com",
      loginMethod: "manus",
      role: "admin",
    },
  ]).onDuplicateKeyUpdate({ set: { name: "Platform Owner" } });

  // Seed Events
  await db.insert(schema.events).values([
    {
      type: "Earthquake",
      severity: "high",
      location: "San Francisco, CA",
      latitude: 37.7749,
      longitude: -122.4194,
      affectedCount: 100000,
      status: "active",
      timestamp: new Date("2026-07-15T10:00:00Z"),
    },
    {
      type: "Wildfire",
      severity: "critical",
      location: "Los Angeles, CA",
      latitude: 34.0522,
      longitude: -118.2437,
      affectedCount: 50000,
      status: "active",
      timestamp: new Date("2026-07-14T14:30:00Z"),
    },
    {
      type: "Flood",
      severity: "medium",
      location: "Houston, TX",
      latitude: 29.7604,
      longitude: -95.3698,
      affectedCount: 20000,
      status: "resolved",
      timestamp: new Date("2026-07-10T08:00:00Z"),
    },
  ]).onDuplicateKeyUpdate({ set: { type: "Earthquake" } });

  // Seed Shelters
  await db.insert(schema.shelters).values([
    {
      name: "Community Hall Shelter",
      location: "123 Main St, San Francisco",
      latitude: 37.7750,
      longitude: -122.4180,
      capacity: 500,
      currentOccupancy: 150,
      contact: "+1-555-123-4567",
      status: "open",
    },
    {
      name: "School Gym Shelter",
      location: "456 Oak Ave, Los Angeles",
      latitude: 34.0500,
      longitude: -118.2400,
      capacity: 300,
      currentOccupancy: 280,
      contact: "+1-555-987-6543",
      status: "full",
    },
  ]).onDuplicateKeyUpdate({ set: { name: "Community Hall Shelter" } });

  // Seed Resources
  await db.insert(schema.resources).values([
    {
      name: "Medical Team Alpha",
      type: "personnel",
      quantity: 10,
      unit: "teams",
      location: "San Francisco, CA",
      latitude: 37.7749,
      longitude: -122.4194,
      status: "deployed",
      lastUpdated: new Date(),
    },
    {
      name: "Water Bottles",
      type: "supplies",
      quantity: 5000,
      unit: "bottles",
      location: "Los Angeles, CA",
      latitude: 34.0522,
      longitude: -118.2437,
      status: "available",
      lastUpdated: new Date(),
    },
  ]).onDuplicateKeyUpdate({ set: { name: "Medical Team Alpha" } });

  console.log("Database seeding complete.");
  await connection.end();
}

seed().catch((err) => {
  console.error("Database seeding failed:", err);
  process.exit(1);
});
