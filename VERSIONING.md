# Documentation Versioning

This document explains how the versioning system works for dotts documentation.

## Overview

The dotts-docs site uses route-based versioning. All versions are served from the same domain:

- `dotts.4o4.sh/docs/...` - Latest documentation (current)
- `dotts.4o4.sh/v0.1/docs/...` - Archived v0.1 documentation (when created)

## Version Configuration

Version information is stored in `version.json` at the repository root:

```json
{
  "current": "0.1",
  "versions": [
    {
      "id": "latest",
      "label": "v0.1.x (latest)",
      "path": "/docs",
      "isLatest": true
    }
  ]
}
```

When a version is archived, it gets added to the versions array:

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

## Available Commands

### Archive a Version

When releasing a new major/minor version of dotts, archive the current docs:

```bash
pnpm version:archive 0.1
```

This command:
1. Copies `content/docs/` to `content/docs-v0.1/`
2. Creates route at `src/app/(archived)/v0.1/docs/[[...slug]]/page.tsx`
3. Creates a source adapter at `src/lib/source-v0.1.ts`
4. Updates `version.json` to add the archived version

### List All Versions

```bash
pnpm version:list
```

### Show Current Version

```bash
pnpm version:current
```

### Sync with dotts Releases

Check if the docs version matches the latest dotts release:

```bash
pnpm version:sync
```

## Workflow for New Releases

### When you're ready to release v0.2 and archive v0.1:

1. **Archive current docs**:
   ```bash
   pnpm version:archive 0.1
   ```

2. **Update source.config.ts** to include the archived collection:
   ```typescript
   export const docsV0_1 = defineDocs({
     dir: "content/docs-v0.1",
     docs: {
       async: true,
     },
   });
   ```

3. **Update version.json** to bump current version label

4. **Build and verify**:
   ```bash
   pnpm build
   ```

5. **Commit and deploy**:
   ```bash
   git add .
   git commit -m "chore: archive v0.1 docs"
   git push
   ```

## Directory Structure

```
content/
  docs/              # Latest docs (always)
  docs-v0.1/         # Archived v0.1 docs (after archiving)

src/app/
  docs/              # Latest docs route
  (archived)/
    v0.1/
      docs/          # Archived v0.1 route

src/lib/
  source.ts          # Latest docs source
  source-v0.1.ts     # Archived v0.1 source (after archiving)
```

## TypeScript API

```typescript
import { getVersionConfig, getCurrentVersion, getVersions } from '@/lib/version';

const config = getVersionConfig();
const current = getCurrentVersion();
const versions = getVersions();
```

## Version Selector Component

The `VersionSelector` component displays in the navigation. It shows:
- Current version label
- Dropdown with links to all version routes
- A "latest" badge for the most recent version

All links are internal (using Next.js Link) since all versions are on the same domain.

## Why Route-Based?

- **Simpler deployment**: One site, one deployment
- **Better SEO**: All content indexed under one domain
- **Easier maintenance**: No branch syncing needed
- **Faster navigation**: No external redirects between versions
