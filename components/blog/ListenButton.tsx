"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play, Square } from "lucide-react";
import { htmlToText } from "@/lib/site";

const SPEEDS = [1, 1.25, 1.5, 2];

/** Read the article aloud with the browser's speech synthesis (no server needed). */
export default function ListenButton({
  title,
  html,
  lang,
  labels,
}: {
  title: string;
  html: string;
  lang: "en" | "id";
  labels: { listen: string; pause: string; resume: string; stop: string };
}) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [speed, setSpeed] = useState(1);
  const run = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported("speechSynthesis" in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  const stop = useCallback(() => {
    run.current++;
    window.speechSynthesis?.cancel();
    setStatus("idle");
  }, []);

  // changing language swaps the article text — stop whatever is playing
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    stop();
  }, [lang, stop]);

  const start = (rate = speed) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const id = ++run.current;
    const text = `${title}. ${htmlToText(html)}`;
    // Chrome silently stops long utterances, so feed it sentence-sized chunks
    const chunks = text.match(/[^.!?\n]+[.!?]*\s*/g)?.reduce<string[]>((acc, s) => {
      const last = acc[acc.length - 1];
      if (last && last.length + s.length < 220) acc[acc.length - 1] = last + s;
      else acc.push(s);
      return acc;
    }, []) ?? [text];
    const voiceLang = lang === "id" ? "id-ID" : "en-US";
    chunks.forEach((c, i) => {
      const u = new SpeechSynthesisUtterance(c);
      u.lang = voiceLang;
      u.rate = rate;
      if (i === chunks.length - 1) u.onend = () => run.current === id && setStatus("idle");
      synth.speak(u);
    });
    setStatus("playing");
  };

  if (!supported) return null;

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 text-sm">
      <button
        onClick={() => {
          if (status === "idle") start();
          else if (status === "playing") {
            window.speechSynthesis.pause();
            setStatus("paused");
          } else {
            window.speechSynthesis.resume();
            setStatus("playing");
          }
        }}
        className="inline-flex h-8 items-center gap-2 rounded-full px-3 font-medium transition-colors hover:bg-muted"
        aria-label={status === "playing" ? labels.pause : status === "paused" ? labels.resume : labels.listen}
      >
        {status === "playing" ? <Pause size={14} /> : status === "paused" ? <Play size={14} /> : <Headphones size={14} />}
        {status === "playing" ? labels.pause : status === "paused" ? labels.resume : labels.listen}
      </button>
      {status !== "idle" && (
        <>
          <button
            onClick={() => {
              const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
              setSpeed(next);
              start(next);
            }}
            className="h-8 rounded-full px-2.5 font-mono text-xs hover:bg-muted"
            aria-label="Change speed"
            title="Playback speed"
          >
            {speed}×
          </button>
          <button onClick={stop} className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted" aria-label={labels.stop}>
            <Square size={12} />
          </button>
        </>
      )}
    </div>
  );
}
