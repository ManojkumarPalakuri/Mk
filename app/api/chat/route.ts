import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import nodemailer from "nodemailer";
import { getSystemPrompt } from "@/lib/ai-context";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Create a custom OpenAI instance pointing to Groq's API inside the request
    // This ensures it correctly reads process.env when the route runs
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY || "",
    });

    const { messages } = await req.json();
    const systemPrompt = getSystemPrompt();

    // Stream responses using Groq's active LLaMA model
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages,
      maxSteps: 2, // allows the AI to call a tool, get the result, and respond back
      tools: {
        sendDirectMessageToManoj: tool({
          description: "Send an email message directly to Manoj. Call this ONLY when the user explicitly asks to send a message or wants to contact Manoj via the chat. YOU MUST stop and explicitly ask the user for their email address and wait for their reply before calling this tool.",
          parameters: z.object({
            userEmail: z.string().email().describe("The user's return email address so Manoj can reply. CRITICAL: You must ask the user for this before calling the tool. Do not guess or make up an email."),
            message: z.string().describe("The actual message content to send to Manoj")
          }),
          execute: async ({ userEmail, message }) => {
            const user = process.env.EMAIL_USER;
            const pass = process.env.EMAIL_PASS;
            
            // If the user hasn't set up Nodemailer securely yet, return a safe fallback message for the AI to read.
            if (!user || !pass) {
              return { success: false, note: "Tell the user: 'My automated email system is not configured yet. Please email Manoj directly at manojkumarpalakuri@gmail.com!'" };
            }

            try {
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user, pass }
              });

              await transporter.sendMail({
                from: `"Ask Manoj AI" <${user}>`,
                replyTo: userEmail || undefined,
                to: user,
                subject: "✨ New Message via Ask Manoj AI",
                text: `You received a new message via your AI Assistant:\n\nFrom: ${userEmail || "Anonymous"}\n\nMessage:\n${message}`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <div style="background-color: #312e81; padding: 20px; text-align: center;">
                      <h2 style="margin: 0; color: #ffffff;">🤖 AI Assistant Notification</h2>
                    </div>
                    <div style="padding: 25px; color: #334155; line-height: 1.6;">
                      <p style="font-size: 16px;">Someone just used your portfolio chatbot to send you a message!</p>
                      <p><strong>From:</strong> ${userEmail ? `<a href="mailto:${userEmail}" style="color: #4f46e5;">${userEmail}</a>` : "<i>Anonymous (No email provided to bot)</i>"}</p>
                      <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 20px 0;"/>
                      <p style="font-weight: 600; margin-bottom: 10px;">Message content:</p>
                      <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                         <p style="margin: 0; white-space: pre-wrap; font-size: 15px;">${message}</p>
                      </div>
                    </div>
                  </div>
                `
              });
              
              return { success: true, note: "Tell the user: 'I have successfully sent your message directly to Manoj! He will get back to you soon.'" };
            } catch (err) {
              console.error("AI Nodemailer Error:", err);
              return { success: false, note: "Tell the user the system failed to send the email due to a network error, and provide the address manojkumarpalakuri@gmail.com." };
            }
          }
        })
      }
    });

    return result.toDataStreamResponse({
      getErrorMessage: (err: any) => {
        console.error("Internal AI Stream Error:", err);
        return "Internal error occurred";
      }
    });
  } catch (error) {
    console.error("[AskManoj API Error]", error);

    // Return a proper data-stream error so useChat shows something
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const msg = "Something went wrong. Please try again or reach out to Manoj at manojkumarpalakuri@gmail.com.";
        for (const char of msg) {
          controller.enqueue(encoder.encode(`0:${JSON.stringify(char)}\n`));
        }
        controller.enqueue(encoder.encode(`d:{"finishReason":"error","usage":{"promptTokens":0,"completionTokens":0}}\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "x-vercel-ai-data-stream": "v1",
      },
    });
  }
}
