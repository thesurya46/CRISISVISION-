import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";
import { schedulingRouter } from "./routers/scheduling";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ==================== EVENTS ====================
  events: router({
    list: publicProcedure.query(async () => {
      return await db.getAllEvents();
    }),
    
    active: publicProcedure.query(async () => {
      return await db.getActiveEvents();
    }),
    
    highSeverity: publicProcedure.query(async () => {
      return await db.getHighSeverityEvents();
    }),
    
    stats: publicProcedure.query(async () => {
      return await db.getEventStats();
    }),
  }),

  // ==================== SHELTERS ====================
  shelters: router({
    list: publicProcedure.query(async () => {
      return await db.getAllShelters();
    }),
    
    stats: publicProcedure.query(async () => {
      return await db.getShelterStats();
    }),
  }),

  // ==================== RESOURCES ====================
  resources: router({
    list: publicProcedure.query(async () => {
      return await db.getAllResources();
    }),
    
    available: publicProcedure.query(async () => {
      return await db.getAvailableResources();
    }),
    
    stats: publicProcedure.query(async () => {
      return await db.getResourceStats();
    }),
  }),

  // ==================== DASHBOARD ====================
  dashboard: router({
    overview: publicProcedure.query(async () => {
      const eventStats = await db.getEventStats();
      const shelterStats = await db.getShelterStats();
      const resourceStats = await db.getResourceStats();
      
      return {
        events: eventStats,
        shelters: shelterStats,
        resources: resourceStats,
      };
    }),
  }),

  // ==================== SCHEDULING ====================
  scheduling: schedulingRouter,
});

export type AppRouter = typeof appRouter;
