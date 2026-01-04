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

### For Patch Releases (v0.1.0 → v0.1.1)
Just update the docs in `content/docs/` and push - no versioning needed.

### For Minor/Major Releases (v0.1.x → v0.2.0)

```bash
# 1. Archive current version
pnpm version:archive 0.1

# 2. Update version.json label to new version (e.g., "v0.2.x (latest)")

# 3. Update docs content for new version

# 4. Commit and push
git add . && git commit -m "release: v0.2, archive v0.1" && git push
```

That's it! The archive script handles copying docs, creating routes, and updating configs.

### Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm version:current` | Show current version |
| `pnpm version:list` | List all versions |
| `pnpm version:archive <ver>` | Archive docs as specified version |
| `pnpm version:sync` | Check sync with dotts releases |

See [VERSIONING.md](./VERSIONING.md) for technical details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
