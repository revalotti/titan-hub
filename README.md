# Titan Design System Hub (DS-like UI, Static)

This package is a lightweight **Hub** that mimics the Audiense/Titan UI style (light, table-based) while linking to:
- **Zeroheight** (documentation)
- **Storybook** (interactive components / implementation)

## Files
- `index.html`
- `styles.css`
- `script.js`
- `manifest.json`

## Edit content
All content is driven by `manifest.json`.

### Embed previews
Add `embedUrl` per component using Storybook’s embeddable URL format (recommended):
- `https://<storybook-host>/iframe.html?id=<your-story-id>`

If Storybook blocks iframes (CSP / X-Frame-Options), previews won’t render, but links still work.

## Deploy to GitHub Pages
1. Create a repo (e.g. `titan-ds-hub`)
2. Upload these files to the repo root
3. Settings → Pages → Deploy from a branch → `main` / `/root`
