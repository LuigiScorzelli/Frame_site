"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const quickOptions = [
  { icon: "⚡", text: "Voglio automatizzare i miei processi", action: "contatti" },
  { icon: "📈", text: "Richiedi un preventivo", action: "contatti" },
  { icon: "📖", text: "Vedi i case study", action: "risultati" },
  { icon: "💬", text: "Parla con il team", action: "email" },
] as const;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleOption(action: string) {
    setOpen(false);
    switch (action) {
      case "contatti":
        router.push("/contatti");
        break;
      case "risultati":
        router.push("/#risultati");
        break;
      case "email":
        window.location.href = "mailto:info@aiframe.it";
        break;
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Panel */}
      <div
        className={cn(
          "absolute bottom-16 right-0 w-80 origin-bottom-right overflow-hidden border border-border bg-bg-1 shadow-2xl shadow-black/40 transition-all duration-300",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-mono text-[11px] font-medium tracking-wider text-accent" style={{ letterSpacing: "1px" }}>FR&gt;ME ASSISTANT</span>
          <button onClick={() => setOpen(false)} className="text-lg text-text-1 transition-colors hover:text-text-0">&times;</button>
        </div>
        <div className="p-4">
          <p className="mb-3 text-sm text-text-1" style={{ lineHeight: 1.5 }}>
            Ciao! Come possiamo aiutarti oggi?
          </p>
          <div className="space-y-2">
            {quickOptions.map((opt) => (
              <button
                key={opt.text}
                onClick={() => handleOption(opt.action)}
                className="w-full border border-border px-3.5 py-2.5 text-left font-mono text-[11px] tracking-[0.5px] text-text-1 transition-all duration-200 hover:border-accent/40 hover:text-text-0"
              >
                {opt.icon} {opt.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pulse ring */}
      {!open && (
        <span className="absolute inset-0 m-auto h-[68px] w-[68px] rounded-full border-2 border-accent opacity-50 animate-ping" style={{ top: "auto", left: "auto" }} />
      )}

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full text-2xl text-bg-0 shadow-lg"
        style={{ background: "linear-gradient(135deg, #BFFF00, #00E5FF)" }}
        aria-label={open ? "Chiudi chat" : "Apri chat"}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
