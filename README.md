# 7TV Emote Exporter

Small static webapp (Vue 3 + Vite) that takes a 7TV channel URL or user ID, fetches the user's emotes via the public 7TV API, and exports the list (name + CDN link, plus animated flag, owner, and ID) in multiple formats: plain text, CSV, JSON, Markdown table, Markdown images, HTML gallery, and BBCode.

## Develop

```sh
npm install
npm run dev
```

## Build & deploy

```sh
npm run build       # outputs dist/ with relative paths (works from any subpath)
npm run preview     # smoke-test the production build locally
```

Upload the contents of `dist/` to any static host.

### Deploy to ohhert.be

```sh
npm run build:ohhert
```

Builds with `base=/tools/export-7tv/` straight into `../ohhert/public/tools/export-7tv/`. Commit + push that repo and trigger the production workflow on GitHub to ship.

## API used

- `GET https://7tv.io/v3/users/{id}` — public, CORS-enabled, no auth.
- Emote CDN: `https://cdn.7tv.app/emote/{id}/{size}.{ext}` where size ∈ {1x, 2x, 3x, 4x} and ext ∈ {webp, avif, png, gif}.
