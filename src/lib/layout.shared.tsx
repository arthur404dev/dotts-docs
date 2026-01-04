import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Terminal } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2 font-bold">
          <Terminal className="size-5" />
          <span>dotts</span>
        </div>
      ),
    },
    links: [
      {
        text: "Documentation",
        url: "/docs",
        active: "nested-url",
      },
      {
        text: "GitHub",
        url: "https://github.com/arthur404dev/dotts",
        external: true,
      },
    ],
    githubUrl: "https://github.com/arthur404dev/dotts",
  };
}
