<h3 align="center">
  <img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png" width="100" alt="Catppuccin Logo"/><br/>
  <img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
  Catppuccin <a href="https://pivoshenko.github.io/catppuccin-startpage">Startpage</a>
  <img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
  <a href="https://github.com/pivoshenko/catppuccin-startpage/stargazers">
    <img src="https://img.shields.io/github/stars/pivoshenko/catppuccin-startpage?style=for-the-badge&logo=starship&color=a6e3a1&logoColor=D9E0EE&labelColor=302D41">
  </a>
  <a href="https://github.com/pivoshenko/catppuccin-startpage/issues">
    <img src="https://img.shields.io/github/issues/pivoshenko/catppuccin-startpage?style=for-the-badge&logo=gitbook&color=fab387&logoColor=D9E0EE&labelColor=302D41">
  </a>
  <a href="https://github.com/pivoshenko/catppuccin-startpage/contributors">
    <img src="https://img.shields.io/github/contributors/pivoshenko/catppuccin-startpage?style=for-the-badge&logo=github&color=f38ba8&logoColor=D9E0EE&labelColor=302D41">
  </a>
</p>

<p align="center">
  <img src="assets/preview.png" alt="startpage preview"/>
</p>

## ✦ Witchy, Cute & Functional

A cozy Catppuccin startpage for your browser, now with stronger i18n support, better Gemini UX, and safer weather error handling.

Think: pastel magic, minimal noise, and practical power for daily browsing.

Based on [`dawn`](https://github.com/b-coimbra/dawn), then heavily customized.

## ✨ What’s New (Latest Updates)

- 🌍 **Localization expanded**:
  - Languages: **Spanish (`es`)**, **English (`en`)**, **Esperanto (`eo`)**
  - Localized category names, weather strings, Gemini UI messages, and date formats
- 🕰️ **Clock improvements**:
  - Localized short/extended date-time formats via i18n
  - Click clock to toggle compact/extended mode
  - Optional multi-timezone clocks
- ☁️ **Weather UX polish**:
  - Better translated weather condition mapping (including fog/mist/haze edge-cases)
  - Friendly fallback when weather API fails + optional technical details in tooltip
- 🔮 **Gemini UX improvements**:
  - Friendlier localized error messaging
  - Expanded results modal with markdown rendering (code, lists, tables, links, images)
  - Google/Gemini toggle in search (`Tab`), open search with `/`, close with `Esc`
- 🎨 **Visual/content updates**:
  - Dynamic tab flavour styling
  - Added `src/img/bg-main.jpg` background asset
  - Docs refreshed for theme + Gemini config clarity

## 🎨 Theme & Style

- Catppuccin palettes: `latte`, `frappe`, `macchiato`, `mocha`
- Automatic light/dark theme system
- Designed to stay clean, soft, and expressive without clutter

## 🔧 Setup

1. Fork and clone this repository.
2. (Optional) Remove `.github` if you don’t need issue/PR templates.
3. Edit [`userconfig.js`](userconfig.js):
   - Choose palette/theme behavior
   - Set weather location and scale
   - Configure tabs/categories/links
   - Pick banners/backgrounds
   - Tune Gemini + i18n in `advanced_config`
4. Refresh your page.

## 🔮 Gemini AI Integration

Dual-mode search is built in:

- `Google` search mode
- `Gemini` mode (inside modal results view)

### Shortcuts

- `/` open search
- `Tab` switch Google ↔ Gemini (while input is focused)
- `Esc` close modal
- `Enter` send query

### API key setup

Get a key from [Google AI Studio](https://makersuite.google.com/app/apikey), then run in browser console:

```javascript
localStorage.setItem('GEMINI_API_KEY', 'your-api-key-here');
```

You can also define `window.GEMINI_API_KEY` in `userconfig.js` (not recommended for public repos).

More details: [GEMINI_SETUP.md](GEMINI_SETUP.md)

## 🌍 Localization (i18n)

Current locales:

- `es` (Spanish)
- `en` (English)
- `eo` (Esperanto)

Default locale is controlled via `advanced_config.i18n.defaultLocale` in [`userconfig.js`](userconfig.js).

Quick switch (console):

```javascript
window.i18n.setLocale('en');
location.reload();
```

See full guide: [LOCALIZATION.md](LOCALIZATION.md)

## 🧪 Useful Config Flags

Inside [`userconfig.js`](userconfig.js):

- `overrideStorage`: prioritize file config over localStorage
- `localIcons` / `localFonts`: use bundled assets for better offline/loading behavior
- `openLastVisitedTab`: restore previous tab on reload
- `additionalClocks`: add clocks with IANA timezones (e.g. `America/New_York`)

## 🌐 Use As Homepage / New Tab

### Homepage

- Open browser settings/preferences
- Set homepage URL to your hosted startpage URL

### New tab

- Firefox: [Custom New Tab Page](https://addons.mozilla.org/en-US/firefox/addon/custom-new-tab-page/?src=search)
- Chromium (Chrome/Brave): [Custom New Tab URL](https://chrome.google.com/webstore/detail/custom-new-tab-url/mmjbdbjnoablegbkcklggeknkfcjkjia)

## 🖼️ Available Banners

| banner_01 | banner_02 | banner_03 | banner_04 |
| --- | --- | --- | --- |
| <img src="src/img/banners/banner_01.gif" width=175> | <img src="src/img/banners/banner_02.gif" width=175> | <img src="src/img/banners/banner_03.gif" width=175> | <img src="src/img/banners/banner_04.gif" width=175> |

| banner_05 | banner_06 | banner_07 | banner_08 |
| --- | --- | --- | --- |
| <img src="src/img/banners/banner_05.gif" width=175> | <img src="src/img/banners/banner_06.gif" width=175> | <img src="src/img/banners/banner_07.gif" width=175> | <img src="src/img/banners/banner_08.gif" width=175> |

| banner_09 | banner_10 | banner_11 | banner_12 |
| --- | --- | --- | --- |
| <img src="src/img/banners/banner_09.gif" width=175> | <img src="src/img/banners/banner_10.gif" width=175> | <img src="src/img/banners/banner_11.gif" width=175> | <img src="src/img/banners/banner_12.gif" width=175> |

| banner_13 | banner_14 | banner_15 | banner_16 |
| --- | --- | --- | --- |
| <img src="src/img/banners/banner_13.gif" width=175> | <img src="src/img/banners/banner_14.gif" width=175> | <img src="src/img/banners/banner_15.gif" width=175> | <img src="src/img/banners/banner_16.gif" width=175> |

| banner_17 | banner_18 | bg-1 | bg-2 |
| --- | --- | --- | --- |
| <img src="src/img/banners/banner_17.gif" width=175> | <img src="src/img/banners/banner_18.gif" width=175> | <img src="src/img/banners/bg-1.gif" width=175> | <img src="src/img/banners/bg-2.gif" width=175> |

| bg-3 | cbg-1 | cbg-2 | cbg-3 |
| --- | --- | --- | --- |
| <img src="src/img/banners/bg-3.gif" width=175> | <img src="src/img/banners/cbg-1.gif" width=175> | <img src="src/img/banners/cbg-2.gif" width=175> | <img src="src/img/banners/cbg-3.gif" width=175> |

| cbg-4 | cbg-5 | cbg-6 | cbg-7 |
| --- | --- | --- | --- |
| <img src="src/img/banners/cbg-4.gif" width=175> | <img src="src/img/banners/cbg-5.gif" width=175> | <img src="src/img/banners/cbg-6.gif" width=175> | <img src="src/img/banners/cbg-7.gif" width=175> |

| cbg-8 | cbg-9 | cbg-10 | cbg-11 |
| --- | --- | --- | --- |
| <img src="src/img/banners/cbg-8.gif" width=175> | <img src="src/img/banners/cbg-9.gif" width=175> | <img src="src/img/banners/cbg-10.gif" width=175> | <img src="src/img/banners/cbg-11.gif" width=175> |

| cbg-12 | cbg-13 |
| --- | --- |
| <img src="src/img/banners/cbg-12.gif" width=175> | <img src="src/img/banners/cbg-13.gif" width=175> |

> Bonus asset: `src/img/bg-main.jpg`

## 🪄 Credits

- Catppuccin palette: [catppuccin.com](https://catppuccin.com/palette)
- Original inspiration: [`dawn`](https://github.com/b-coimbra/dawn)

If you make your own witchy variation, share it. ✦
