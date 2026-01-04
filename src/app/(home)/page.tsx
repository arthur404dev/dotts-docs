import {
  ArrowRight,
  GitBranch,
  Layers,
  Monitor,
  Package,
  Sparkles,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/copy-button";

const features = [
  {
    icon: Terminal,
    title: "Beautiful TUI",
    description:
      "Interactive wizard guides you through setup with a stunning terminal interface built with Charm libraries.",
  },
  {
    icon: Layers,
    title: "Profile Inheritance",
    description:
      "Compose configurations with inheritance chains like base → linux → desktop for maximum reusability.",
  },
  {
    icon: GitBranch,
    title: "Alternate Files",
    description:
      "Machine-specific configs with the ## suffix pattern. One repo, multiple machines.",
  },
  {
    icon: Monitor,
    title: "Cross-Platform",
    description:
      "Works on Linux (Arch, Debian, Ubuntu, Fedora) and macOS out of the box.",
  },
  {
    icon: Package,
    title: "Multi Package Manager",
    description:
      "Supports Nix, Homebrew, pacman/yay, apt, and dnf. Use what works for you.",
  },
  {
    icon: Sparkles,
    title: "Separated Concerns",
    description:
      "CLI tool is independent from your config repository. Clean architecture, clean workflow.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <section className="hero-gradient relative flex flex-col items-center justify-center px-6 py-24 text-center md:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-muted/50 px-4 py-1.5 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span>v1.0 coming soon</span>
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Manage your{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            dotfiles
          </span>{" "}
          with style
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-fd-muted-foreground md:text-xl">
          A beautiful CLI for managing dotfiles across multiple machines and
          platforms. Opinionated defaults, infinite flexibility.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="https://github.com/arthur404dev/dotts"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 font-medium transition-colors hover:bg-fd-muted"
          >
            View on GitHub
          </Link>
        </div>

        <div className="mt-12 w-full max-w-xl">
          <div className="group relative rounded-lg border border-fd-border bg-fd-card p-4 shadow-lg">
            <div className="flex items-center gap-2 text-fd-muted-foreground">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-yellow-500/80" />
                <div className="size-3 rounded-full bg-green-500/80" />
              </div>
              <span className="ml-2 text-xs">Terminal</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <code className="font-mono text-sm md:text-base">
                <span className="text-fd-muted-foreground">$ </span>
                <span className="text-purple-400">curl</span>
                <span className="text-fd-foreground"> -fsSL </span>
                <span className="text-green-400">
                  https://dotts.4o4.sh/install.sh
                </span>
                <span className="text-fd-foreground"> | </span>
                <span className="text-purple-400">bash</span>
              </code>
              <CopyButton text="curl -fsSL https://dotts.4o4.sh/install.sh | bash" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-fd-border bg-fd-muted/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Everything you need for dotfile management
            </h2>
            <p className="mt-4 text-fd-muted-foreground">
              Built with modern tooling and a focus on developer experience.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card">
                <feature.icon className="size-10 text-fd-primary" />
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-fd-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
          <p className="mt-4 text-fd-muted-foreground">
            Get up and running in three simple steps.
          </p>

          <div className="mt-12 grid gap-8 text-left md:grid-cols-3">
            <div className="relative">
              <div className="flex size-10 items-center justify-center rounded-full bg-fd-primary text-lg font-bold text-fd-primary-foreground">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold">Install</h3>
              <p className="mt-2 text-fd-muted-foreground">
                One command installs the dotts CLI on any supported platform.
              </p>
            </div>
            <div className="relative">
              <div className="flex size-10 items-center justify-center rounded-full bg-fd-primary text-lg font-bold text-fd-primary-foreground">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold">Initialize</h3>
              <p className="mt-2 text-fd-muted-foreground">
                Run{" "}
                <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm">
                  dotts init
                </code>{" "}
                and follow the interactive wizard.
              </p>
            </div>
            <div className="relative">
              <div className="flex size-10 items-center justify-center rounded-full bg-fd-primary text-lg font-bold text-fd-primary-foreground">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold">Enjoy</h3>
              <p className="mt-2 text-fd-muted-foreground">
                Your system is configured. Use{" "}
                <code className="rounded bg-fd-muted px-1.5 py-0.5 text-sm">
                  dotts update
                </code>{" "}
                to stay in sync.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-fd-border bg-fd-muted/30 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-4 text-fd-muted-foreground">
            Check out the documentation to learn more about dotts and how to
            configure it for your workflow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
            >
              Read the Docs
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="https://github.com/arthur404dev/dotts-starter"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-6 py-3 font-medium transition-colors hover:bg-fd-muted"
            >
              Explore Starter Template
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-fd-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-fd-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Terminal className="size-4" />
            <span>dotts</span>
          </div>
          <p>
            Built by{" "}
            <a
              href="https://github.com/arthur404dev"
              className="font-medium text-fd-foreground underline-offset-4 hover:underline"
            >
              arthur404dev
            </a>
            . Open source on{" "}
            <a
              href="https://github.com/arthur404dev/dotts"
              className="font-medium text-fd-foreground underline-offset-4 hover:underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}
