import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `I am your virtual assistant here to help you with all your car servicing needs. How can I assist you today? 
Here are some of the services we offer:
1. Oil Change
2. Tire Installation
3. Engine Inspection
4. Windshield Repair
5. Brake Service
6. Battery Replacement
7. Transmission Service
8. Air Conditioning Repair
9. Suspension Repair

Note: If you are unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.`;

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...data,
    ],
    model: "gpt-4o-mini",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (error) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
