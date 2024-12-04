import openai from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
      const { message } = await request.json();
  
      if (!message) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
      }
  
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
        functions: [
            {
              name: "play",
              description: "Play or resume the video",
              parameters: {},
            },
            {
              name: "pause",
              description: "Pause the video",
              parameters: {},
            },
            {
              name: "stop",
              description: "Stop the video and reset to the beginning",
              parameters: {},
            },
            {
              name: "fullscreen",
              description: "Make the video fullscreen",
              parameters: {},
            },
            {
                name: "seek",
                description: "Seek to a specific time in the video",
                parameters: {
                  type: "object",
                  properties: {
                    time: { type: "number", description: "Time in seconds to seek to" },
                  },
                  required: ["time"],
                },
              },
          ],
        function_call: "auto",
      });
  
      return NextResponse.json(response);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }
  