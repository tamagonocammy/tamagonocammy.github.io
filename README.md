<h3 align="center">
  <img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png" width="100" alt="Logo"/><br/>
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
  <img src="assets/preview.png"/>
</p>

## 🪴 Overview

Aesthetic and clean startpage in [**Catppuccin**](https://catppuccin.com/palette) style, hosted on GitHub Pages.
This startpage is based on the [`dawn`](https://github.com/b-coimbra/dawn), which has even more functionality.
I've tweaked the page to match my [`dotfiles`](https://github.com/pivoshenko/dotfiles) so check them out as well.

### 🧠 Main principles

- Minimalism in everything
- Consistency
- Simplicity
- One style
- Reduced visual noise

### 🎨 Supported Palettes

- Latte
- Frappé
- Macchiato
- Mocha

### ✨ Gemini AI Integration

This startpage now includes **Google Gemini AI** integration! 

- 🔍 **Dual Search Mode**: Toggle between Google Search and Gemini AI (press `Tab` in search)
- 🪟 **Expanded Results Window**: Beautiful modal overlay for AI responses
- 🎨 **Markdown Support**: Formatted responses with code blocks, lists, and more
- ⌨️ **Keyboard Shortcuts**: Quick access with `/` key

> [!NOTE]
> To use Gemini AI, you'll need a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey).
> See [GEMINI_SETUP.md](GEMINI_SETUP.md) for detailed setup instructions.

### 🌍 Localization

This startpage now supports **multiple languages**!

- 🇪🇸 **Spanish** (default)
- 🇬🇧 **English**
- 📅 **Localized dates**: Day names, month names, and time formats
- 🔍 **Localized UI**: Search placeholders, weather conditions, and more

**Change language:**
```javascript
// Open browser console (F12) and run:
window.i18n.setLocale('en'); // English
window.i18n.setLocale('es'); // Spanish
location.reload();
```

> [!TIP]
> See [LOCALIZATION.md](LOCALIZATION.md) for detailed documentation on adding new languages and using the i18n API.

## 🪵 Usage

1. Fork this repository and clone it
2. Optionally remove the `.github` directory as it contains only PR templates, issue labels, etc that are linked to this repository
3. Update [`userconfig.js`](userconfig.js):
   - Set the desired palette: `latte / frappe / macchiato / mocha`
   - Set your location for the weather widget
   - Update the number of pages and their banners
   - Update bookmarks and quick links for the one you are using the most :3

> [!TIP]
> You can find icons for your bookmarks using [`tabler-icons`](https://tabler.io/icons)
>
> If you want to reduce the loading time of the icons, you could install the icon [font](src/fonts) locally and activate the option `"localIcons": true` in the config to disable the remote styles

#### As Homepage

- Click the menu button and select `Options/Preferences`
- Click the home panel
- Click the menu next to the homepage and new windows and choose to show custom URLs and add your GitHub Pages link

#### As New Tab

You can use different add-ons/extensions for it

- If you use Firefox: [Custom New Tab Page](https://addons.mozilla.org/en-US/firefox/addon/custom-new-tab-page/?src=search) and make sure you enable "Force links to open in the top frame (experimental)" in the extension's preferences page
- If you use Chromium (Brave / Chrome): [Custom New Tab URL](https://chrome.google.com/webstore/detail/custom-new-tab-url/mmjbdbjnoablegbkcklggeknkfcjkjia)

### 🖼️ Available banners

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

| cbg-12 | cbg-13 |  |  |
| --- | --- | --- | --- |
| <img src="src/img/banners/cbg-12.gif" width=175> | <img src="src/img/banners/cbg-13.gif" width=175> |  |  |
