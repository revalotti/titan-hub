# Titan Foundations · Colors

This repository now starts from scratch with **Foundations** and a first deliverable: **Color tokens**.

## Files
- `colors.tokens.json`: source of truth for color tokens.
  - `color.primitive.*`: base scales (100-900)
  - `color.semantic.system-ui.*`: semantic aliases referencing primitive tokens
- `index.html`: simple foundations page
- `styles.css`: visual styles for token presentation
- `script.js`: renders token families from `colors.tokens.json`

## Run
```bash
python3 -m http.server 4173 --bind 0.0.0.0
```
