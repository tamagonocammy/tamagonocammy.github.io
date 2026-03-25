# Colorscheme Compatibility Test

Gemini integration is palette-aware and uses `CONFIG.palette` values, so it adapts to all Catppuccin flavours.

## Supported Palettes

- `latte` (light)
- `frappe` (dark)
- `macchiato` (dark)
- `mocha` (dark)

## How to Test

This project uses automatic theme selection with `initThemeSystem(preferredLightTheme, preferredDarkTheme)`.

1. Open `userconfig.js`
2. Edit these values:

```javascript
const preferredLightTheme = latte;
const preferredDarkTheme = mocha;
```

3. Try combinations (`latte`/`frappe`, `latte`/`macchiato`, etc.)
4. Save and reload
5. Test Google mode + Gemini mode

## What Should Adapt Automatically

- Overlay background and blur
- Modal surface and shadows
- Inputs, borders, icons
- Loading spinner colors
- Error state colors
- Markdown content colors (`h1-h3`, code, links, blockquotes, tables)

## Quick Checklist

- [ ] Open search overlay (`/`)
- [ ] Toggle to Gemini (`Tab`)
- [ ] Run a query
- [ ] Validate loading state colors
- [ ] Validate markdown rendering colors
- [ ] Trigger an error (temporary invalid key)
- [ ] Switch palette and repeat

## Color Source of Truth

All Gemini UI styling reads from `CONFIG.palette.*` (for example: `base`, `mantle`, `surface0-2`, `overlay0-1`, `text`, `mauve`, `blue`, `green`, `red`, `peach`, `crust`).

No hardcoded fixed theme colors should be required for Gemini UI.
