#!/bin/sh
# Versioning script for dotts-docs
# Route-based versioning: /docs (latest), /v0.1/docs (archived), etc.
# POSIX sh compatible

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
VERSION_FILE="$ROOT_DIR/version.json"
CONTENT_DIR="$ROOT_DIR/content"
APP_DIR="$ROOT_DIR/src/app"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_error() {
    printf "${RED}Error: %s${NC}\n" "$1" >&2
}

print_success() {
    printf "${GREEN}%s${NC}\n" "$1"
}

print_info() {
    printf "${BLUE}%s${NC}\n" "$1"
}

print_warning() {
    printf "${YELLOW}%s${NC}\n" "$1"
}

check_jq() {
    if ! command -v jq >/dev/null 2>&1; then
        print_error "jq is required but not installed. Please install jq."
        exit 1
    fi
}

cmd_current() {
    check_jq
    
    if [ ! -f "$VERSION_FILE" ]; then
        print_error "version.json not found"
        exit 1
    fi
    
    current=$(jq -r '.current' "$VERSION_FILE")
    
    echo "Current Version Information"
    echo "==========================="
    echo "Version: $current"
    echo ""
    echo "Configured Versions:"
    jq -r '.versions[] | "  \(.id): \(.label) -> \(.path)\(if .isLatest then " [LATEST]" else "" end)"' "$VERSION_FILE"
}

cmd_list() {
    check_jq
    
    echo "Available Versions"
    echo "=================="
    
    if [ ! -f "$VERSION_FILE" ]; then
        print_error "version.json not found"
        exit 1
    fi
    
    jq -r '.versions[] | "  \(.id) (\(.label)) -> \(.path)\(if .isLatest then " [LATEST]" else "" end)"' "$VERSION_FILE"
    
    echo ""
    echo "Content Directories"
    echo "==================="
    ls -d "$CONTENT_DIR"/docs* 2>/dev/null | sed 's|.*/|  |' || echo "  docs (latest only)"
}

cmd_archive() {
    check_jq
    
    version="$1"
    
    if [ -z "$version" ]; then
        print_error "Version number required. Usage: $0 archive <version>"
        echo "Example: $0 archive 0.1"
        exit 1
    fi
    
    if ! echo "$version" | grep -qE '^[0-9]+\.[0-9]+$'; then
        print_error "Invalid version format. Use format like: 0.1, 0.2, 1.0"
        exit 1
    fi
    
    version_dir="docs-v${version}"
    version_path="/v${version}/docs"
    archived_dir="$CONTENT_DIR/$version_dir"
    route_dir="$APP_DIR/(archived)/v${version}/docs/[[...slug]]"
    
    if [ -d "$archived_dir" ]; then
        print_error "Archived version already exists at $archived_dir"
        exit 1
    fi
    
    print_info "Archiving version $version..."
    
    print_info "1. Copying content/docs/ to content/$version_dir/"
    cp -r "$CONTENT_DIR/docs" "$archived_dir"
    print_success "   Created $archived_dir"
    
    print_info "2. Creating archived route at src/app/(archived)/v${version}/docs/[[...slug]]/"
    mkdir -p "$route_dir"
    
    cat > "$route_dir/page.tsx" << EOF
import { source as archivedSource } from "@/lib/source-v${version}";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = archivedSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return archivedSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = archivedSource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
EOF
    print_success "   Created page.tsx"
    
    mkdir -p "$APP_DIR/(archived)/v${version}/docs"
    cat > "$APP_DIR/(archived)/v${version}/docs/layout.tsx" << EOF
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";
import { source as archivedSource } from "@/lib/source-v${version}";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={archivedSource.pageTree}
      {...baseOptions}
      nav={{
        ...baseOptions.nav,
        title: (
          <>
            {baseOptions.nav?.title}
            <span className="ml-2 rounded bg-fd-muted px-1.5 py-0.5 text-xs font-medium text-fd-muted-foreground">
              v${version}
            </span>
          </>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
EOF
    print_success "   Created layout.tsx"
    
    print_info "3. Creating source adapter for archived version"
    cat > "$ROOT_DIR/src/lib/source-v${version}.ts" << EOF
import { docs as archivedDocs } from "@/../.source/docs-v${version}";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

export const source = loader({
  baseUrl: "/v${version}/docs",
  source: createMDXSource(archivedDocs, []),
});
EOF
    print_success "   Created src/lib/source-v${version}.ts"
    
    print_info "4. Updating version.json"
    label="v${version}.x"
    
    jq --arg id "v${version}" --arg label "$label" --arg path "$version_path" \
        '.versions += [{"id": $id, "label": $label, "path": $path, "isLatest": false}]' \
        "$VERSION_FILE" > "$VERSION_FILE.tmp" && mv "$VERSION_FILE.tmp" "$VERSION_FILE"
    
    current_label=$(jq -r '.versions[] | select(.isLatest == true) | .label' "$VERSION_FILE")
    new_current=$(echo "$current_label" | sed 's/ (latest)//')
    jq --arg label "$new_current (latest)" \
        '(.versions[] | select(.isLatest == true) | .label) = $label' \
        "$VERSION_FILE" > "$VERSION_FILE.tmp" && mv "$VERSION_FILE.tmp" "$VERSION_FILE"
    
    print_success "   Updated version.json"
    
    echo ""
    print_success "Version $version archived successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Update source.config.ts to include the archived docs collection"
    echo "  2. Run 'pnpm build' to verify everything works"
    echo "  3. Commit the changes"
    echo ""
    echo "Add to source.config.ts:"
    echo ""
    echo '  export const docsV'$(echo "$version" | tr '.' '_')' = defineDocs({'
    echo '    dir: "content/docs-v'$version'",'
    echo '    docs: {'
    echo '      async: true,'
    echo '    },'
    echo '  });'
}

cmd_sync() {
    check_jq
    
    print_info "Syncing version with main dotts repository..."
    
    if command -v curl >/dev/null 2>&1; then
        latest_tag=$(curl -s "https://api.github.com/repos/arthur404dev/dotts/releases/latest" 2>/dev/null | jq -r '.tag_name // empty' 2>/dev/null)
        
        if [ -n "$latest_tag" ]; then
            print_success "Latest dotts release: $latest_tag"
            
            version=$(echo "$latest_tag" | sed 's/^v//')
            major_minor=$(echo "$version" | cut -d. -f1,2)
            
            current=$(jq -r '.current' "$VERSION_FILE")
            
            if [ "$major_minor" != "$current" ]; then
                print_warning "Docs version ($current) differs from dotts version ($major_minor)"
                echo "Consider archiving the current version: ./scripts/version.sh archive $current"
            else
                print_success "Docs version is in sync with dotts"
            fi
        else
            print_warning "Could not fetch latest release from dotts repository"
        fi
    else
        print_error "curl is required for sync operation"
        exit 1
    fi
}

usage() {
    echo "Usage: $0 <command> [arguments]"
    echo ""
    echo "Commands:"
    echo "  archive <version>  Archive current docs to /v<version>/docs route"
    echo "  list               List all configured versions"
    echo "  current            Show current version info"
    echo "  sync-to-dotts      Check if docs version matches latest dotts release"
    echo ""
    echo "Examples:"
    echo "  $0 archive 0.1     # Archives docs to /v0.1/docs route"
    echo "  $0 list            # Lists all versions"
    echo "  $0 current         # Shows current version"
}

case "${1:-}" in
    archive)
        cmd_archive "$2"
        ;;
    list)
        cmd_list
        ;;
    current)
        cmd_current
        ;;
    sync-to-dotts)
        cmd_sync
        ;;
    -h|--help|help)
        usage
        ;;
    "")
        usage
        exit 1
        ;;
    *)
        print_error "Unknown command: $1"
        usage
        exit 1
        ;;
esac
