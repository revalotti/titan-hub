# Titan Foundations

This repository is focused on **Foundations** and currently includes:
- `Colors`
- `Colors Opacity`
- `Typography`

## Files
- `colors.tokens.json`: source of truth for color tokens.
  - `color.primitive.*`: base scales (100-900)
  - `color.semantic.system-ui.*`: semantic aliases referencing primitive tokens
  - `color.opacity.*`: opacity scales 10-90 built from base `600` (except `white` and `black`, base `900`)
- `typography.tokens.json`: source of truth for typography tokens.
  - primitive: family, size, leading, weight, case, decoration
  - utility: headings, body and special style mappings
- `index.html`: Foundations / Colors page
- `colors-opacity.html`: Foundations / Colors Opacity page
- `typography.html`: Foundations / Typography page
- `styles.css`: shared styles for foundations pages
- `script.js`: renderer for `index.html`

## Run
```bash
python3 -m http.server 4173 --bind 0.0.0.0
```
