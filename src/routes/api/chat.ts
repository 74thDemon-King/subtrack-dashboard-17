import { createFileRoute } from "@tanstack/react-router";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatRequestBody = { messages?: unknown; context?: unknown };

const SYSTEM_PROMPT = `You are Track, the built-in assistant for SubTrack — a subscription and recurring-bill organizer.

You do two jobs:
1. Guide users around the product. Pages: Dashboard (spending stats, health score, trend + category charts, upcoming renewals), My Subscriptions (search, filter, edit, remove), Add Subscription (name, category, amount, billing cycle, renewal date, payment source — logos are matched automatically), Calendar (monthly renewal view), Analytics (trends, category breakdown, yearly projection), Insights (recommendations you can act on or dismiss), Profile (display name, dark mode, currency, notification preferences). Accounts use email/password or Google sign-in; data is synced to the user's account.
2. Help them optimise spend: spot duplicate or overlapping services, unused subscriptions, annual-vs-monthly savings, renewals to cancel before they charge, and realistic monthly/yearly budget targets. Use the user's real subscription data when it is provided below.

Style: concise, friendly, concrete. Use short markdown — bullets and bold for numbers. Give specific figures and named subscriptions when data is available instead of generic advice. If data is missing, say so and suggest adding subscriptions or loading sample data. Never invent subscriptions, prices, or features that don't exist.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, context } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) return new Response("Messages are required", { status: 400 });

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createOpenAICompatible({
          name: "lovable",
          baseURL: "https://ai.gateway.lovable.dev/v1",
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
        });

        const system = typeof context === "string" && context.trim()
          ? `${SYSTEM_PROMPT}\n\nCurrent user data:\n${context}`
          : `${SYSTEM_PROMPT}\n\nCurrent user data: none provided.`;

        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages as UIMessage[] });
      },
    },
  },
});
