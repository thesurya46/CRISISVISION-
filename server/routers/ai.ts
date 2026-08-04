import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const DISASTER_SYSTEM_PROMPT = `You are an expert disaster response coordinator with deep knowledge of emergency management, disaster protocols, resource allocation, and crisis communication. Provide actionable, evidence-based guidance for disaster response scenarios. Always prioritize safety and life-saving measures. Be concise but thorough in your responses.`;

/**
 * AI router powering the AI Assistant chat.
 * Uses the shared LLM client (invokeLLM) to generate real responses.
 */
export const aiRouter = router({
  chat: protectedProcedure
    .input(
      z.object({
        messages: z.array(messageSchema).min(1),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Always prepend the disaster-response system prompt if not present.
        const hasSystem = input.messages.some((m) => m.role === "system");
        const messages = hasSystem
          ? input.messages
          : [{ role: "system" as const, content: DISASTER_SYSTEM_PROMPT }, ...input.messages];

        const result = await invokeLLM({
          messages: messages as any,
          maxTokens: 1024,
        });

        const content = result.choices?.[0]?.message?.content;
        if (typeof content !== "string") {
          throw new Error("Unexpected LLM response format");
        }

        return { content };
      } catch (error) {
        console.error("[AI Chat] LLM error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? `AI service unavailable: ${error.message}`
              : "AI service unavailable",
        });
      }
    }),
});
