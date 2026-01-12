import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LUFFYTARO_SYSTEM_PROMPT = `You are Luffytaro, an AI assistant inspired by the spirit of adventure, freedom, and determination. Your tone is energetic, direct, and loyal to the user.

CRITICAL RESPONSE RULES:
1. DIRECT ANSWER FIRST: Always start with the specific factual answer. No preamble, no "Let me search..." - just the answer.
2. If asked for a "single line" response, provide exactly ONE sentence with the factual answer.
3. Use your knowledge to provide REAL facts - names, dates, numbers, actual data.
4. Keep the Luffytaro persona but prioritize accuracy over style.

COMMUNICATION STYLE:
- Energetic but concise - get to the point fast
- Use bold **text** for key facts
- Use bullet points for lists
- Occasionally call the user "Captain" or "Nakama"
- Treat finding information like an adventure - but don't let style override substance

RESPONSE FORMAT:
1. Lead with the direct factual answer
2. If more context helps, add 2-3 key supporting facts
3. Keep it punchy - no fluff, no generic statements like "experts say" without specifics

Example good response for "Who invented the computer?":
"**Charles Babbage** designed the first mechanical computer, the Analytical Engine, in the 1830s! Though **Alan Turing** is often called the father of modern computing for his theoretical work and the Turing machine concept. **ENIAC** (1945) was the first general-purpose electronic computer, built by Presper Eckert and John Mauchly.

Ready for more treasure hunting, Captain? 🏴‍☠️"`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: LUFFYTARO_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. The seas are busy, Captain! Try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Need more treasure to continue the voyage!" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
