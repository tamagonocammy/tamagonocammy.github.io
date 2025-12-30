# Gemini AI Integration Setup Guide

This startpage now includes **Google Gemini AI** integration! You can toggle between Google Search and Gemini AI by pressing `Tab` in the search box.

## Features

- 🔍 **Dual Search Mode**: Toggle between Google Search and Gemini AI
- 🪟 **Expanded Results Window**: Gemini responses appear in a beautiful modal overlay
- 🎨 **Markdown Support**: Formatted responses with code blocks, lists, and more
- ⌨️ **Keyboard Shortcuts**: Quick access with `/` key

## Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

**Note**: The Gemini API has a generous free tier, perfect for personal use!

## Setting Up Your API Key

You have two options to configure your API key:

### Option 1: Browser Console (Recommended)

This method stores your API key locally in your browser and is more secure if you're sharing your startpage configuration.

1. Open your browser's developer console (press `F12`)
2. Run the following command:
   ```javascript
   localStorage.setItem('GEMINI_API_KEY', 'your-api-key-here');
   ```
3. Reload the page

### Option 2: userconfig.js

If you're not sharing your configuration publicly, you can add it directly to `userconfig.js`:

1. Open `userconfig.js`
2. Find the Gemini API Key section at the top
3. Uncomment and set:
   ```javascript
   window.GEMINI_API_KEY = "your-api-key-here";
   ```
4. Save and reload

## How to Use

1. **Open Search**: Click the icon in the top-left corner OR press `/` on your keyboard
2. **Toggle Search Engine**: Press `Tab` to switch between Google and Gemini
   - 🔵 Google icon = Google Search (redirects to Google)
   - ✨ Sparkles icon = Gemini AI (shows results in expanded window)
3. **Search**: Type your query and press `Enter`
4. **View Results**: 
   - Google: Opens in new tab
   - Gemini: Displays in beautiful expanded window
5. **Close Results**: Click the `X` button, click outside the window, or press `Escape`

## Keyboard Shortcuts

- `/` - Open search overlay
- `Tab` - Toggle between Google and Gemini
- `Enter` - Execute search
- `Escape` - Close any open overlay

## Troubleshooting

### "API key not configured" error
- Make sure you've set your API key using one of the methods above
- Check that you've reloaded the page after setting the key
- Verify your API key is correct (no extra spaces or quotes)

### "Failed to get response from Gemini" error
- Check your internet connection
- Verify your API key is valid
- Make sure you haven't exceeded the free tier quota
- Try regenerating your API key in Google AI Studio

### Results not showing
- Check browser console (F12) for any error messages
- Make sure you're pressing `Tab` to switch to Gemini mode (sparkles icon should be visible)
- Verify JavaScript is enabled in your browser

## Privacy & Security

- Your API key is stored locally in your browser (localStorage) or in your local config file
- Queries are sent directly to Google's Gemini API
- No data is stored or logged by this startpage
- Consider using Option 1 (localStorage) if you plan to share your startpage configuration publicly

## Customization

You can customize the Gemini integration in `src/components/statusbar/statusbar.component.js`:

- **Model parameters**: Adjust `temperature`, `topK`, `topP`, and `maxOutputTokens` in the `queryGemini()` method
- **Styling**: Modify the CSS in the `style()` method
- **Markdown formatting**: Update the `formatMarkdown()` method

## API Limits

The free tier of Gemini API includes:
- 60 requests per minute
- Generous daily quota

For most personal use cases, the free tier is more than sufficient!

## Credits

Gemini integration powered by [Google Generative AI](https://ai.google.dev/)

---

Enjoy your AI-powered startpage! 🚀