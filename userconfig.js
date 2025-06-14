// latte / frappe / macchiato / mocha
const palette = mocha;

const default_config = {
  overrideStorage: true,
  temperature: {
    location: "Bogota",
    scale: "C",
  },
  clock: {
    format: "a, b d | h:i p",
    iconColor: palette.maroon,
  },
  disabled: [],
  fastlink: "https://search.brave.com",
  openLastVisitedTab: true,
  tabs: [
    {
      name: "M i l i e",
      background_url: "src/img/banners/bg-3.gif",
      categories: [
        {
          name: "main",
          links: [
            {
              name: "chatgpt",
              url: "https://chat.openai.com",
              icon: "brand-openai",
              icon_color: palette.green,
            },
            {
              name: "bluesky",
              url: "https://bsky.app",
              icon: "brand-bluesky",
              icon_color: palette.sky,
            },
            {
              name: "maps",
              url: "https://maps.google.com",
              icon: "map-2",
              icon_color: palette.red,
            },
            {
              name: "reykunyu",
              url: "https://reykunyu.lu/",
              icon: "book-2",
              icon_color: palette.lavender,
            },
          ],
        },
        {
          name: "workspace",
          links: [
            {
              name: "gmail",
              url: "https://mail.google.com",
              icon: "brand-gmail",
              icon_color: palette.green,
            },
            {
              name: "calendar",
              url: "https://calendar.google.com",
              icon: "calendar-filled",
              icon_color: palette.peach,
            },
            {
              name: "drive",
              url: "https://drive.google.com/drive/home",
              icon: "brand-google-drive",
              icon_color: palette.blue,
            },
            {
              name: "docs",
              url: "https://docs.google.com",
              icon: "file-text",
              icon_color: palette.teal,
            },
          ],
        },
        {
          name: "media",
          links: [
            {
              name: "netflix",
              url: "https://netflix.com",
              icon: "brand-netflix",
              icon_color: palette.red,
            },
            {
              name: "apple music",
              url: "https://music.apple.com/",
              icon: "brand-apple",
              icon_color: palette.peach,
            },
            {
              name: "soundcloud",
              url: "https://soundcloud.com/",
              icon: "brand-soundcloud",
              icon_color: palette.maroon,
            },
            {
              name: "prime video",
              url: "https://www.primevideo.com",
              icon: "brand-amazon",
              icon_color: palette.teal,
            },
          ],
        },
      ],
    },
    {
      name: "dev",
      background_url: "src/img/banners/cbg-7.gif",
      categories: [
        {
          name: "resources",
          links: [
            {
              name: "github",
              url: "https://github.com",
              icon: "brand-github",
              icon_color: palette.green,
            },
            {
              name: "claude",
              url: "https://claude.ai",
              icon: "robot-face",
              icon_color: palette.peach,
            },
            {
              name: "catppuccin",
              url: "https://catppuccin.com/",
              icon: "palette",
              icon_color: palette.red,
            },
            {
              name: "stackoverflow",
              url: "https://stackoverflow.com",
              icon: "brand-stackoverflow",
              icon_color: palette.blue,
            },
          ],
        },
        {
          name: "challenges",
          links: [
            {
              name: "kaggle",
              url: "https://www.kaggle.com",
              icon: "brain",
              icon_color: palette.green,
            },
            {
              name: "leetcode",
              url: "https://leetcode.com",
              icon: "code-plus",
              icon_color: palette.peach,
            },
            {
              name: "exercism",
              url: "https://exercism.org",
              icon: "code-minus",
              icon_color: palette.red,
            },
            {
              name: "monkeytype",
              url: "https://monkeytype.com",
              icon: "keyboard",
              icon_color: palette.yellow,
            },
          ],
        },
        {
          name: "blogs",
          links: [
            {
              name: "genbeta",
              url: "https://www.genbeta.com//",
              icon: "versions",
              icon_color: palette.teal,
            },
            {
              name: "hackernews",
              url: "https://news.ycombinator.com",
              icon: "brand-redhat",
              icon_color: palette.peach,
            },
            {
              name: "xataka",
              url: "https://www.xataka.com/",
              icon: "binary-tree",
              icon_color: palette.green,
            },
            {
              name: "google research",
              url: "https://blog.research.google",
              icon: "hexagon-letter-g",
              icon_color: palette.blue,
            },
          ],
        },
      ],
    },
    {
      name: "c h i l l",
      background_url: "src/img/banners/cbg-10.gif",
      categories: [
        {
          name: "social medias",
          links: [
            {
              name: "twitter",
              url: "https://twitter.com",
              icon: "brand-twitter",
              icon_color: palette.teal,
            },
            {
              name: "instagram",
              url: "https://www.instagram.com",
              icon: "brand-instagram",
              icon_color: palette.peach,
            },
            {
              name: "reddit",
              url: "https://www.reddit.com/",
              icon: "brand-reddit",
              icon_color: palette.red,
            },
            {
              name: "discord",
              url: "https://discord.com/app",
              icon: "brand-discord",
              icon_color: palette.lavender,
            },
          ],
        },
        {
          name: "games",
          links: [
            {
              name: "IGN",
              url: "https://www.ign.com/news",
              icon: "device-gamepad",
              icon_color: palette.green,
            },
            {
              name: "steam",
              url: "https://store.steampowered.com",
              icon: "brand-steam",
              icon_color: palette.peach,
            },
            {
              name: "epicgames",
              url: "https://store.epicgames.com",
              icon: "brand-fortnite",
              icon_color: palette.red,
            },
            {
              name: "gog",
              url: "https://www.gog.com",
              icon: "device-gamepad-2",
              icon_color: palette.mauve,
            },
          ],
        },
        {
          name: "video",
          links: [
            {
              name: "anilist",
              url: "https://anilist.co/home",
              icon: "brand-funimation",
              icon_color: palette.green,
            },
            {
              name: "youtube",
              url: "https://www.youtube.com",
              icon: "brand-youtube",
              icon_color: palette.peach,
            },
            {
              name: "patreon",
              url: "https://www.patreon.com",
              icon: "brand-patreon",
              icon_color: palette.red,
            },
            {
              name: "twitch",
              url: "https://www.twitch.tv",
              icon: "brand-twitch",
              icon_color: palette.mauve,
            },
            {
              name: "crunchyroll",
              url: "https://www.crunchyroll.com",
              icon: "eye",
              icon_color: palette.peach,
            },
          ],
        },
      ],
    },
  ],
};

const CONFIG = new Config(default_config, palette);

const root = document.querySelector(":root");
root.style.setProperty("--bg", palette.mantle);
root.style.setProperty("--accent", palette.green);
