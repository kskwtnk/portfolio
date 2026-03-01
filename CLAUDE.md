# CLAUDE.md

Astro-based portfolio site for Keisuke Watanuki. All website content is in Japanese.

## Language

- Always respond to the user in Japanese
- Keep code comments and commit messages in English

## Commands

Package manager: `pnpm`

- `pnpm dev` - Start dev server (localhost:4321)
- `pnpm build` - Production build to `./dist/`
- `pnpm check` - Run all Biome checks (lint + format + assist)
- `pnpm check:fix` - Auto-fix all Biome issues

Always run `pnpm check` after making changes to verify code quality.

## Architecture

### Content Collections

Content schemas are defined in `src/content.config.ts`. The `qiita-articles` collection uses a custom loader that fetches from the Qiita API at build time — see `src/content.config.ts` for the loader implementation with timeout and error handling.

### 3D Background Effect

`src/effects/granyGradients.ts` renders animated gradient effects using Three.js with custom GLSL shaders (`src/effects/*.glsl`). These run on the homepage only.

### Styling

TailwindCSS v4 via Vite plugin. Typography uses Shippori Mincho font family for Japanese content.

## Gotchas

- Biome's VSCode extension does not reliably format `.astro` files on save (known upstream issue). Use `pnpm check:fix` to format these files.
- The `[about].astro` and `[...id].astro` pages use Astro's dynamic routing with `getStaticPaths()` — content collection entries drive the routes.
