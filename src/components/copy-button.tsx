"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md p-2 text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="size-4 text-fd-primary" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  );
}
