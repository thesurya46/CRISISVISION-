import { protectedProcedure, router } from "../_core/trpc";
import { createHeartbeatJob, deleteHeartbeatJob, updateHeartbeatJob } from "../_core/heartbeat";
import { parse as parseCookie } from "cookie";
import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

/**
 * Scheduling router for managing periodic disaster event ingestion jobs.
 * Only the platform owner can create/manage these jobs.
 */
export const schedulingRouter = router({
  /**
   * Create an hourly disaster event ingestion job.
   * Runs every hour to simulate new disaster data.
   */
  createIngestionJob: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      cronExpression: z.string().default("0 * * * * *"), // Every hour
    }))
    .mutation(async ({ ctx, input }) => {
      // Only owner can create scheduling jobs
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can create scheduled jobs",
        });
      }

      const sessionToken = parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";

      try {
        const job = await createHeartbeatJob(
          {
            name: `disaster-ingestion-${input.name}`,
            cron: input.cronExpression,
            path: "/api/scheduled/ingestDisasterEvents",
            description: input.description || "Hourly disaster event ingestion job",
          },
          sessionToken
        );

        return {
          success: true,
          taskUid: job.taskUid,
          message: `Scheduled job created successfully`,
        };
      } catch (error) {
        console.error("Failed to create scheduling job:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create scheduled job",
        });
      }
    }),

  /**
   * Update an existing ingestion job.
   */
  updateIngestionJob: protectedProcedure
    .input(z.object({
      taskUid: z.string(),
      cronExpression: z.string().optional(),
      enable: z.boolean().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can update scheduled jobs",
        });
      }

      const sessionToken = parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";

      try {
        await updateHeartbeatJob(
          input.taskUid,
          {
            cron: input.cronExpression,
            enable: input.enable,
            description: input.description,
          },
          sessionToken
        );

        return {
          success: true,
          message: `Job updated successfully`,
        };
      } catch (error) {
        console.error("Failed to update scheduling job:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update scheduled job",
        });
      }
    }),

  /**
   * Delete an ingestion job.
   */
  deleteIngestionJob: protectedProcedure
    .input(z.object({
      taskUid: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can delete scheduled jobs",
        });
      }

      const sessionToken = parseCookie(ctx.req.headers.cookie ?? "")[COOKIE_NAME] ?? "";

      try {
        await deleteHeartbeatJob(input.taskUid, sessionToken);

        return {
          success: true,
          message: "Job deleted successfully",
        };
      } catch (error) {
        console.error("Failed to delete scheduling job:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete scheduled job",
        });
      }
    }),
});
