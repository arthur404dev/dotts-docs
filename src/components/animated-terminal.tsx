"use client";

import { useState, useEffect } from "react";

const command = "curl -fsSL https://dotts.4o4.sh/install.sh | sh";

const outputLines = [
  { id: "detect", text: "→ Detecting system...", type: "info", delay: 0 },
  { id: "found", text: "✓ Found: linux/amd64", type: "success", delay: 300 },
  { id: "download", text: "✓ Downloading dotts v0.1.0", type: "success", delay: 600 },
  { id: "install", text: "✓ Installing to ~/.local/bin", type: "success", delay: 900 },
  { id: "ready", text: "✓ Ready! Run: dotts init", type: "success", delay: 1200 },
];

export function AnimatedTerminal() {
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showOutput, setShowOutput] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typed.length < command.length) {
      const timeout = setTimeout(() => {
        setTyped(command.slice(0, typed.length + 1));
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setShowOutput(true), 200);
      return () => clearTimeout(timeout);
    }
  }, [typed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCopy();
    }
  };

  const renderCommand = () => {
    if (typed.length === 0) return null;

    const parts = [];
    const curlEnd = Math.min(4, typed.length);
    const flagEnd = Math.min(10, typed.length);
    const urlEnd = Math.min(42, typed.length);
    const pipeEnd = Math.min(45, typed.length);

    if (curlEnd > 0) {
      parts.push(
        <span key="curl" className="text-fd-primary">
          {typed.slice(0, curlEnd)}
        </span>
      );
    }
    if (typed.length > 4) {
      parts.push(
        <span key="flag" className="text-fd-muted-foreground">
          {typed.slice(4, flagEnd)}
        </span>
      );
    }
    if (typed.length > 10) {
      parts.push(
        <span key="url" className="text-fd-foreground">
          {typed.slice(10, urlEnd)}
        </span>
      );
    }
    if (typed.length > 42) {
      parts.push(
        <span key="pipe" className="text-fd-muted-foreground">
          {typed.slice(42, pipeEnd)}
        </span>
      );
    }
    if (typed.length > 45) {
      parts.push(
        <span key="sh" className="text-fd-primary">
          {typed.slice(45)}
        </span>
      );
    }

    return parts;
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      onKeyDown={handleKeyDown}
      className="group relative w-full max-w-xl cursor-pointer rounded-lg border border-fd-border bg-fd-card text-left shadow-lg transition-all hover:border-fd-primary/50 focus:outline-none focus:ring-2 focus:ring-fd-ring"
    >
      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-fd-primary px-3 py-1.5 text-sm font-medium text-fd-primary-foreground shadow-md">
          Copied!
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-fd-border px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-fd-primary/60" />
          <div className="size-3 rounded-full bg-fd-primary/40" />
          <div className="size-3 rounded-full bg-fd-primary/20" />
        </div>
        <span className="ml-2 text-xs text-fd-muted-foreground">Terminal</span>
        <div className="ml-auto text-xs text-fd-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          Click to copy
        </div>
      </div>

      <div className="space-y-1.5 p-4 font-mono text-sm">
        <div className="flex items-center">
          <span className="mr-2 text-fd-primary">❯</span>
          <span>{renderCommand()}</span>
          <span
            className={`ml-0.5 text-fd-primary transition-opacity ${showCursor ? "opacity-100" : "opacity-0"}`}
          >
            █
          </span>
        </div>

        {showOutput &&
          outputLines.map((line) => (
            <div
              key={line.id}
              className="animate-fade-in opacity-0"
              style={{ 
                animationDelay: `${line.delay}ms`,
                animationFillMode: "forwards"
              }}
            >
              <span
                className={
                  line.type === "success"
                    ? "text-fd-primary"
                    : "text-fd-muted-foreground"
                }
              >
                {line.text}
              </span>
            </div>
          ))}
      </div>
    </button>
  );
}
