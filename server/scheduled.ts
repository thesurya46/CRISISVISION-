import { Request, Response } from "express";
import { getDb } from "./db";
import { events } from "../drizzle/schema";
import { sdk } from "./_core/sdk";

/**
 * Scheduled handler for ingesting new disaster events and updating metrics.
 * Runs hourly to simulate real-time disaster data ingestion.
 */
export async function handleDisasterEventIngestion(req: Request, res: Response) {
  try {
    // Authenticate the request as a cron job
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database connection unavailable" });
    }

    // Simulate new disaster event data ingestion
    const newEvents = generateSimulatedDisasterEvents();

    // Insert new events into the database
    for (const event of newEvents) {
      await db.insert(events).values(event);
    }

    console.log(`[Scheduled Job] Ingested ${newEvents.length} new disaster events`);

    return res.json({
      ok: true,
      eventsIngested: newEvents.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Scheduled Job] Error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      context: { url: req.url, taskUid: (req as any).user?.taskUid },
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Generate simulated disaster events for testing and demo purposes.
 */
function generateSimulatedDisasterEvents() {
  const disasterTypes = ["Earthquake", "Hurricane", "Tornado", "Flood", "Wildfire"];
  const severities = ["low", "medium", "high", "critical"];
  const statuses = ["active", "contained", "resolved"];
  const locations = [
    { name: "San Francisco, CA", lat: 37.7749, lng: -122.4194 },
    { name: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
    { name: "Houston, TX", lat: 29.7604, lng: -95.3698 },
    { name: "Miami, FL", lat: 25.7617, lng: -80.1918 },
    { name: "Seattle, WA", lat: 47.6062, lng: -122.3321 },
  ];

  // Randomly decide if we should generate events (30% chance)
  if (Math.random() > 0.3) {
    return [];
  }

  const eventCount = Math.floor(Math.random() * 3) + 1; // 1-3 events
  const events = [];

  for (let i = 0; i < eventCount; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const type = disasterTypes[Math.floor(Math.random() * disasterTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];

    events.push({
      type,
      severity: severity as "low" | "medium" | "high" | "critical",
      location: location.name,
      latitude: location.lat,
      longitude: location.lng,
      affectedCount: Math.floor(Math.random() * 50000) + 1000,
      status: statuses[Math.floor(Math.random() * statuses.length)] as "active" | "contained" | "resolved",
      timestamp: new Date(),
    });
  }

  return events;
}
