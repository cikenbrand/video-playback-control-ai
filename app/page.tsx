"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  play,
  pause,
  stop,
  fullscreen,
  seek,
} from "@/app/actions/videoactions";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSend = async () => {
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response from API");
      }

      const data = await res.json();
      const action = data?.choices?.[0]?.message?.function_call?.name;
      const params = data?.choices?.[0]?.message?.function_call?.arguments;

      if (action) {
        setResponse(`Action to perform: ${action}`);

        // Trigger the corresponding function
        if (action === "play") play(videoRef);
        if (action === "pause") pause(videoRef);
        if (action === "stop") stop(videoRef);
        if (action === "fullscreen") fullscreen(videoRef);
        if (action === "seek" && params) {
          const { time } = JSON.parse(params);
          seek(videoRef, time);
        }
      } else {
        setResponse("No action detected.");
      }
    } catch (error) {
      console.error(error);
      setResponse("Something went wrong!");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Function Calling Demo</h1>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Playback command..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
      <div className="mt-4">
        <video
          ref={videoRef}
          src="/sample-video.mp4"
          controls
          className="w-96 h-auto rounded-md shadow"
        />
      </div>
      <div>
        <p className="text-lg">AI Response: {response}</p>
      </div>
    </main>
  );
}
