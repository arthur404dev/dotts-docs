# dotts-docs

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

A `source.config.ts` config file has been included, you can customise different options like frontmatter schema.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Versioning

The documentation uses route-based versioning. Current docs live at `/docs` (latest).

When ready to archive a version (e.g., when releasing v0.2):

```bash
pnpm version:archive 0.1
```

This copies current docs to `/v0.1/docs/...` and keeps `/docs/` as latest.

See [VERSIONING.md](./VERSIONING.md) for full details.

## Releasing a New Version

This guide walks through releasing a new version of dotts and updating the documentation.

### Prerequisites

- Ensure all documentation for the current version is complete and accurate
- Coordinate with the main dotts repo release

### Step-by-Step Release Process

#### 1. Archive the Current Documentation

Before releasing v0.2, archive the current v0.1 docs:

```bash
# Archive current docs to /v0.1/docs/...
pnpm version:archive 0.1
```

This automatically:
- Copies `content/docs/` → `content/docs-v0.1/`
- Creates route at `src/app/(archived)/v0.1/docs/`
- Creates source adapter at `src/lib/source-v0.1.ts`
- Updates `version.json` with the archived version

#### 2. Update the Source Configuration

Edit `source.config.ts` to register the archived docs collection:

```typescript
import { defineDocs, defineCollections } from "fumadocs-mdx/config";

export const { docs, meta } = defineDocs({
  dir: "content/docs",
});

// Add archived version
export const { docs: docsV0_1, meta: metaV0_1 } = defineDocs({
  dir: "content/docs-v0.1",
});
```

#### 3. Update version.json

Update the "latest" label to reflect the new version:

```json
{
  "current": "0.2",
  "versions": [
    {
      "id": "latest",
      "label": "v0.2.x (latest)",
      "path": "/docs",
      "isLatest": true
    },
    {
      "id": "v0.1",
      "label": "v0.1.x",
      "path": "/v0.1/docs",
      "isLatest": false
    }
  ]
}
```

#### 4. Update Documentation Content

Update the main `/docs` content for the new version:
- Update any version numbers in examples
- Add new features documentation
- Update the changelog/what's new section

#### 5. Build and Test Locally

```bash
pnpm build
pnpm start

# Test both versions work:
# - http://localhost:3000/docs (latest v0.2)
# - http://localhost:3000/v0.1/docs (archived v0.1)
```

#### 6. Commit and Deploy

```bash
git add .
git commit -m "chore: release v0.2, archive v0.1 docs"
git push
```

Vercel will automatically deploy the changes.

### Version Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm version:current` | Show current version info |
| `pnpm version:list` | List all configured versions |
| `pnpm version:archive <version>` | Archive current docs as specified version |
| `pnpm version:sync` | Check if docs version matches dotts release |

### Directory Structure After Archiving

```
dotts-docs/
├── content/
│   ├── docs/              # Latest (v0.2) - always edit here
│   └── docs-v0.1/         # Archived v0.1 - read-only
├── src/
│   ├── app/
│   │   ├── docs/          # Latest docs route
│   │   └── (archived)/
│   │       └── v0.1/
│   │           └── docs/  # Archived v0.1 route
│   └── lib/
│       ├── source.ts      # Latest docs source
│       └── source-v0.1.ts # Archived v0.1 source
└── version.json           # Version configuration
```

See [VERSIONING.md](./VERSIONING.md) for additional technical details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
