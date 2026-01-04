"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { VersionConfig, Version } from "@/lib/version";

interface VersionSelectorProps {
  config: VersionConfig;
}

/**
 * Extracts the slug part after /docs/ from a pathname.
 * Examples:
 *   "/docs/installation" -> "installation"
 *   "/v0.1/docs/commands/sync" -> "commands/sync"
 *   "/docs" -> ""
 *   "/v0.1/docs" -> ""
 */
function extractSlug(pathname: string): string {
  // Match either /docs/... or /v{version}/docs/...
  const match = pathname.match(/^(?:\/v[\d.]+)?\/docs(?:\/(.*))?$/);
  if (match) {
    return match[1] || "";
  }
  return "";
}

function buildVersionHref(version: Version, currentSlug: string): string {
  if (!currentSlug) {
    return version.path;
  }
  return `${version.path}/${currentSlug}`;
}

export function VersionSelector({ config }: VersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const currentVersion = config.versions.find((v) => v.isLatest);
  const currentSlug = extractSlug(pathname);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (!currentVersion) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-md border border-fd-border bg-fd-background px-2.5 py-1.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-muted"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span>{currentVersion.label}</span>
        <ChevronDown
          className={`size-4 text-fd-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] overflow-hidden rounded-md border border-fd-border bg-fd-popover py-1 shadow-lg">
          {config.versions.map((version) => (
            <Link
              key={version.id}
              href={buildVersionHref(version, currentSlug)}
              className={`flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors hover:bg-fd-muted ${
                version.isLatest
                  ? "bg-fd-muted/50 text-fd-primary"
                  : "text-fd-foreground"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center gap-2">
                {version.label}
                {version.isLatest && (
                  <span className="rounded bg-fd-primary/10 px-1.5 py-0.5 text-xs font-medium text-fd-primary">
                    latest
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
