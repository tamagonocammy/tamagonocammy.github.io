/**
 * Now Playing Component.
 * Shows the track playing in Apple Music, read from the local helper in tools/nowplaying
 * (a browser page can't see Music.app on its own). Click (or the `m` shortcut) opens a popup
 * with artwork, progress and playback controls, a Last.fm love button (when the helper has
 * Last.fm credentials) and a link to the song's lyrics on Genius.
 * Hidden whenever the helper isn't running or nothing is playing.
 *
 * @extends {Component}
 */
class NowPlaying extends Component {
  refs = {
    wrapper: ".np-wrapper",
    label: ".np-label",
    popup: ".np-popup",
    art: ".np-art",
    artFallback: ".np-art-fallback",
    title: ".np-title",
    artist: ".np-artist",
    bar: ".np-progress-fill",
    elapsed: ".np-elapsed",
    duration: ".np-duration",
    playPause: ".np-playpause",
    love: ".np-love",
    genius: ".np-genius",
  };

  // Tabler's heart outline; filled in CSS when loved (the bundled Tabler font has no filled icons)
  static HEART_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/></svg>`;
  // Genius brand mark (Simple Icons, CC0); Tabler has no Genius icon
  static GENIUS_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M0 6.827c0 2.164.79 4.133 2.167 5.51.393.393.786.59 1.18.983h.195c.197 0 .196-.196.196-.196-.393-.787-.588-1.77-.588-2.754 0-2.164.982-4.329 2.36-5.706V1.518c0-.197-.197-.196-.197-.196h-2.95C.789 2.896 0 4.664 0 6.827zm2.559 12.59c2.36 2.164 5.31 3.343 8.851 3.343 7.082 0 12.59-5.702 12.59-12.586 0-3.344-1.378-6.492-3.542-8.656h-.196c0-.197-.196 0-.196 0 .59 1.574.983 3.147.983 4.918 0 7.278-5.902 13.373-13.377 13.373-1.77 0-3.344-.393-4.917-.983-.197 0-.196.199-.196.395zm5.9-11.998c0 .59.395 1.178.788 1.571h.392c3.54 1.18 4.722-.193 4.722-1.767V5.056c0-.196.196-.196.196-.196h.787c.197 0 .196-.196.196-.196-.196-1.18-.784-2.358-1.571-3.342h-2.363c0-.197-.196 0-.196.196v2.95c0 1.574-1.18 2.754-2.754 2.951 0-.197-.196 0-.196 0z"/></svg>`;

  static OFFLINE_POLL_MS = 30 * 1000; // helper not running: check back now and then

  track = null; // last answer from the helper
  popupOpen = false;
  _pollTimer = null;
  _tickTimer = null;
  _listeners = [];

  get baseUrl() {
    return (advanced_config?.nowPlaying?.url || "http://127.0.0.1:47615").replace(/\/$/, "");
  }

  get pollMs() {
    return Math.max(1, advanced_config?.nowPlaying?.pollSeconds ?? 3) * 1000;
  }

  t(key, fallback) {
    const full = `music.${key}`;
    const value = window.i18n?.t(full);
    return value && value !== full ? value : fallback;
  }

  imports() {
    return [this.getIconResource("tabler"), this.getFontResource("lato")];
  }

  style() {
    return `
      :host {
          display: none;
      }

      :host([active]) {
          display: block;
          animation: np-in .4s var(--ease-out) backwards;
      }

      @keyframes np-in {
          from { opacity: 0; transform: translateY(4px); }
      }

      .np-wrapper {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          font: 400 9pt 'Lato', sans-serif;
          color: ${CONFIG.palette.text};
          white-space: nowrap;
      }

      /* Little equalizer that dances while music plays */
      .np-eq {
          display: inline-flex;
          align-items: flex-end;
          gap: 2px;
          height: 11px;
      }

      .np-eq span {
          width: 2px;
          height: 100%;
          border-radius: 1px;
          background: ${CONFIG.palette.pink};
          transform-origin: bottom;
          animation: np-eq 1s ease-in-out infinite;
      }

      .np-eq span:nth-child(2) { animation-delay: -.4s; animation-duration: .8s; }
      .np-eq span:nth-child(3) { animation-delay: -.7s; animation-duration: 1.2s; }

      @keyframes np-eq {
          0%, 100% { transform: scaleY(.3); }
          50% { transform: scaleY(1); }
      }

      .np-wrapper.paused .np-eq span {
          animation-play-state: paused;
          background: ${CONFIG.palette.overlay1};
      }

      .np-label {
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
      }

      /* Too long to fit: scroll it as a seamless loop (two copies side by side), with soft edges */
      .np-label.scrolling {
          text-overflow: clip;
          mask-image: linear-gradient(to right, transparent, #000 10px, #000 calc(100% - 14px), transparent);
      }

      .np-marquee {
          display: inline-block;
      }

      .np-label.scrolling .np-marquee {
          animation: np-marquee var(--np-marquee-dur, 12s) linear infinite;
      }

      .np-marquee-copy + .np-marquee-copy {
          padding-left: var(--np-marquee-gap);
      }

      /* Hold still at the start for a moment, then glide one copy's width to the left */
      @keyframes np-marquee {
          0%, 18% { transform: translateX(0); }
          100% { transform: translateX(calc(-1 * var(--np-marquee-shift))); }
      }

      /* Easier to read on hover, and it rests with the music */
      .np-label.scrolling:hover .np-marquee,
      .np-wrapper.paused .np-label.scrolling .np-marquee {
          animation-play-state: paused;
      }

      @media (prefers-reduced-motion: reduce) {
          .np-label.scrolling { mask-image: none; text-overflow: ellipsis; }
          .np-label.scrolling .np-marquee { animation: none; }
          .np-marquee-copy + .np-marquee-copy { display: none; }
      }

      .np-label strong {
          font-weight: 700;
      }

      .np-label .np-label-artist {
          color: ${CONFIG.palette.subtext0};
      }

      .np-label.changed {
          animation: np-swap .45s var(--ease-out);
      }

      @keyframes np-swap {
          from { opacity: 0; transform: translateY(6px); }
      }

      /* Popup, same look and motion as the weather one */
      .np-popup {
          position: absolute;
          bottom: calc(100% + 8px);
          right: -1em;
          width: 260px;
          box-sizing: border-box;
          padding: 14px;
          background: ${CONFIG.palette.mantle};
          border: 1px solid ${CONFIG.palette.surface1};
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, .35);
          z-index: 100;
          cursor: default;
          white-space: normal;
          transform-origin: bottom right;
          transition: opacity .2s var(--ease-out), transform .3s var(--ease-spring), visibility 0s;
      }

      .np-popup.hidden {
          opacity: 0;
          transform: translateY(6px) scale(.96);
          visibility: hidden;
          pointer-events: none;
          transition: opacity .15s ease, transform .15s ease, visibility 0s linear .15s;
      }

      .np-popup:not(.hidden) .np-cover {
          animation: np-cover-in .5s var(--ease-spring) backwards;
      }

      @keyframes np-cover-in {
          from { opacity: 0; transform: scale(.9); }
      }

      .np-cover {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 6px;
          overflow: hidden;
          background: ${CONFIG.palette.surface0};
          box-shadow: 0 6px 18px rgba(0, 0, 0, .35);
      }

      /* Above the music-note fallback, which only shows while there's no art */
      .np-art {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: opacity .3s ease;
      }

      .np-art[hidden] {
          display: none;
      }

      .np-art-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          color: ${CONFIG.palette.surface2};
      }

      .np-meta {
          margin-top: 12px;
          text-align: center;
      }

      .np-title {
          font: 700 11pt 'Lato', sans-serif;
          color: ${CONFIG.palette.text};
          /* Full text here, wrapping as needed; the status bar label is the short version */
          white-space: normal;
          overflow-wrap: anywhere;
          line-height: 1.3;
      }

      .np-artist {
          margin-top: 2px;
          font: 400 8.5pt 'Lato', sans-serif;
          color: ${CONFIG.palette.subtext0};
          white-space: normal;
          overflow-wrap: anywhere;
          line-height: 1.35;
      }

      .np-progress {
          margin-top: 12px;
          height: 4px;
          border-radius: 2px;
          background: ${CONFIG.palette.surface1};
          overflow: hidden;
      }

      .np-progress-fill {
          height: 100%;
          width: 0;
          background: ${CONFIG.palette.pink};
          border-radius: 2px;
          transition: width 1s linear;
      }

      .np-times {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
          font: 400 7.5pt 'Lato', sans-serif;
          color: ${CONFIG.palette.subtext0};
          font-variant-numeric: tabular-nums;
      }

      .np-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
      }

      .np-controls button,
      .np-controls a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 50%;
          background: none;
          color: ${CONFIG.palette.text};
          font-size: 18px;
          cursor: pointer;
          transition: background-color .2s ease, color .2s ease, transform .15s var(--ease-out);
      }

      .np-controls button:hover,
      .np-controls button:focus-visible,
      .np-controls a:hover,
      .np-controls a:focus-visible {
          background: ${CONFIG.palette.surface0};
          color: ${CONFIG.palette.pink};
          outline: none;
      }

      .np-controls button:active,
      .np-controls a:active {
          transform: scale(.88);
      }

      /* Love and Genius flank the playback buttons, a little smaller and quieter */
      .np-controls .np-love,
      .np-controls .np-genius {
          width: 30px;
          height: 30px;
          color: ${CONFIG.palette.subtext0};
          text-decoration: none;
      }

      .np-controls svg {
          width: 17px;
          height: 17px;
      }

      .np-genius svg {
          width: 15px;
          height: 15px;
          fill: currentColor;
      }

      .np-genius:hover,
      .np-genius:focus-visible {
          color: ${CONFIG.palette.yellow} !important;
      }

      .np-love svg {
          fill: transparent;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: fill .2s ease;
      }

      /* Keeps its place (so the row stays centred) while Last.fm isn't set up */
      .np-love[hidden] {
          display: flex;
          visibility: hidden;
      }

      .np-controls .np-love.loved {
          color: ${CONFIG.palette.red};
      }

      .np-love.loved svg {
          fill: currentColor;
      }

      .np-love.pop svg {
          animation: np-pop .45s var(--ease-spring);
      }

      @keyframes np-pop {
          40% { transform: scale(1.3); }
      }

      .np-love.busy {
          opacity: .6;
          pointer-events: none;
      }

      .np-controls .np-playpause {
          width: 42px;
          height: 42px;
          font-size: 22px;
          background: ${CONFIG.palette.pink};
          color: ${CONFIG.palette.base};
      }

      .np-controls .np-playpause:hover,
      .np-controls .np-playpause:focus-visible {
          background: ${CONFIG.palette.pink};
          color: ${CONFIG.palette.base};
          filter: brightness(1.1);
      }
    `;
  }

  template() {
    return `
      <div class="np-wrapper">
        <span class="np-eq" aria-hidden="true"><span></span><span></span><span></span></span>
        <span class="np-label"></span>

        <div class="np-popup hidden" role="dialog" aria-label="${this.t("title", "Now playing")}">
          <div class="np-cover">
            <div class="np-art-fallback"><i class="ti ti-music"></i></div>
            <img class="np-art" alt="" hidden>
          </div>
          <div class="np-meta">
            <div class="np-title"></div>
            <div class="np-artist"></div>
          </div>
          <div class="np-progress"><div class="np-progress-fill"></div></div>
          <div class="np-times"><span class="np-elapsed">0:00</span><span class="np-duration">0:00</span></div>
          <div class="np-controls">
            <button class="np-love" hidden aria-pressed="false" title="${this.t("love", "Love on Last.fm")}" aria-label="${this.t("love", "Love on Last.fm")}">${NowPlaying.HEART_SVG}</button>
            <button class="np-prev" data-action="previous" title="${this.t("previous", "Previous")}"><i class="ti ti-player-skip-back"></i></button>
            <button class="np-playpause" data-action="playpause" title="${this.t("pause", "Pause")}"><i class="ti ti-player-pause"></i></button>
            <button class="np-next" data-action="next" title="${this.t("next", "Next")}"><i class="ti ti-player-skip-forward"></i></button>
            <a class="np-genius" target="_blank" rel="noopener noreferrer" title="${this.t("lyrics", "Lyrics on Genius")}" aria-label="${this.t("lyrics", "Lyrics on Genius")}">${NowPlaying.GENIUS_SVG}</a>
          </div>
        </div>
      </div>`;
  }

  listen(target, type, handler) {
    target.addEventListener(type, handler);
    this._listeners.push([target, type, handler]);
  }

  setEvents() {
    this.refs.wrapper.addEventListener("click", (e) => {
      // Clicks inside the popup (controls, artwork) shouldn't close it
      if (e.composedPath().includes(this.refs.popup)) return;
      e.stopPropagation();
      this.togglePopup();
    });
    this.refs.popup.addEventListener("click", (e) => {
      e.stopPropagation();
      const button = e.target.closest("button[data-action]");
      if (button) this.control(button.dataset.action);
      if (e.target.closest(".np-love")) this.toggleLove();
    });
    this.refs.art.addEventListener("load", () => (this.refs.art.hidden = false));
    this.refs.art.addEventListener("error", () => (this.refs.art.hidden = true));

    this.listen(document, "click", (e) => {
      if (!e.composedPath().includes(this)) this.closePopup();
    });
    this.listen(document, "keydown", (e) => {
      if (e.key === "Escape") this.closePopup();
    });
    this.listen(document, "startpage:popup-open", (e) => {
      if (e.detail?.id !== "nowplaying") this.closePopup();
    });
    // No polling in background tabs; catch up the moment the tab is visible again
    this.listen(document, "visibilitychange", () => {
      if (document.visibilityState === "visible") this.poll();
    });
  }

  togglePopup() {
    this.popupOpen ? this.closePopup() : this.openPopup();
  }

  openPopup() {
    if (!this.hasAttribute("active")) return;
    this.popupOpen = true;
    this.refs.popup.classList.remove("hidden");
    document.dispatchEvent(new CustomEvent("startpage:popup-open", { detail: { id: "nowplaying" } }));
  }

  closePopup() {
    this.popupOpen = false;
    this.refs.popup?.classList?.add("hidden");
  }

  /** Asks the helper what's playing. Returns the track, or an error object when the helper is unreachable. */
  async fetchNow() {
    try {
      const response = await fetch(`${this.baseUrl}/now`, { cache: "no-store" });
      if (!response.ok) return { error: true, message: `HTTP ${response.status}` };
      return await response.json();
    } catch (error) {
      return { error: true, message: error?.message || String(error) };
    }
  }

  async poll() {
    clearTimeout(this._pollTimer);
    const result = await this.fetchNow();
    this.update(result.error ? null : result);
    if (document.visibilityState === "visible") {
      this._pollTimer = setTimeout(() => this.poll(), result.error ? NowPlaying.OFFLINE_POLL_MS : this.pollMs);
    }
  }

  async control(action) {
    try {
      // text/plain keeps this a "simple" request (no CORS preflight)
      const response = await fetch(`${this.baseUrl}/control`, { method: "POST", body: action });
      if (response.ok) this.update(await response.json());
    } catch {
      // Helper went away; the next poll hides the widget
    }
    // Skipping takes Music a moment; look again shortly
    setTimeout(() => this.poll(), 600);
  }

  /** Loves or unloves the current track on Last.fm, through the helper (which holds the keys). */
  async toggleLove() {
    const loved = this.track?.lastfm?.loved;
    if (!this.track?.lastfm) return;
    const love = this.refs.love;
    love.classList.add("busy");
    // Show the change right away; put it back if Last.fm says no
    this.showLoved(!loved);
    if (!loved) {
      love.classList.remove("pop");
      void love.offsetWidth;
      love.classList.add("pop");
    }
    const result = await this.sendLove(loved ? "unlove" : "love");
    love.classList.remove("busy");
    if (result.error) this.showLoved(loved);
    else this.update(result);
  }

  async sendLove(action) {
    try {
      const response = await fetch(`${this.baseUrl}/love`, { method: "POST", body: action });
      const reply = await response.json();
      return response.ok ? reply : { error: true, message: reply?.message || `HTTP ${response.status}` };
    } catch (error) {
      return { error: true, message: error?.message || String(error) };
    }
  }

  showLoved(loved) {
    const love = this.refs.love;
    love.classList.toggle("loved", !!loved);
    love.setAttribute("aria-pressed", String(!!loved));
    const label = loved ? this.t("unlove", "Unlove on Last.fm") : this.t("love", "Love on Last.fm");
    love.title = label;
    love.setAttribute("aria-label", label);
  }

  /** Current position in seconds, moved forward by the time since the helper answered. */
  position() {
    const track = this.track;
    if (!track) return 0;
    const drift = track.state === "playing" && track.at ? Date.now() / 1000 - track.at : 0;
    return Math.min(track.position + drift, track.duration || Infinity);
  }

  formatTime(seconds) {
    const total = Math.max(0, Math.floor(seconds || 0));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  }

  escape(text) {
    return String(text ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  update(track) {
    const visible = !!track && track.state !== "stopped" && !!(track.title || track.artist);
    const previous = this.track;
    this.track = visible ? track : null;
    this.toggleAttribute("active", visible);

    if (!visible) {
      this.closePopup();
      clearInterval(this._tickTimer);
      this._tickTimer = null;
      return;
    }

    const playing = track.state === "playing";
    this.refs.wrapper.classList.toggle("paused", !playing);

    // Inline label; slides in when the song changes
    const label = this.refs.label;
    const changed = previous?.id !== track.id || previous?.title !== track.title;
    const text = `<strong>${this.escape(track.title)}</strong>${
      track.artist ? ` <span class="np-label-artist">· ${this.escape(track.artist)}</span>` : ""
    }`;
    // Only rebuild when the text changes, so each poll doesn't restart the scroll
    if (text !== this._labelText) {
      this._labelText = text;
      this.setLabel(text);
    }
    label.title = [track.title, track.artist, track.album].filter(Boolean).join(" — ");
    if (changed && previous) {
      label.classList.remove("changed");
      void label.offsetWidth; // restart the animation
      label.classList.add("changed");
    }

    // Popup
    this.refs.title.textContent = track.title || "";
    this.refs.artist.textContent = [track.artist, track.album].filter(Boolean).join(" — ");
    if (track.artwork && this.refs.art.getAttribute("src") !== track.artwork) {
      this.refs.art.hidden = true; // shown again on load
      this.refs.art.src = track.artwork;
    } else if (!track.artwork) {
      this.refs.art.hidden = true;
      this.refs.art.removeAttribute("src");
    }
    this.refs.playPause.innerHTML = `<i class="ti ti-player-${playing ? "pause" : "play"}"></i>`;
    this.refs.playPause.title = playing ? this.t("pause", "Pause") : this.t("play", "Play");
    this.refs.duration.textContent = this.formatTime(track.duration);
    this.tick();

    // Last.fm love: only when the helper has credentials; null = not known yet
    this.refs.love.hidden = !track.lastfm;
    if (track.lastfm && !this.refs.love.classList.contains("busy")) this.showLoved(track.lastfm.loved);

    // Genius search for this song (no API needed)
    const query = [track.artist, track.title].filter(Boolean).join(" ");
    this.refs.genius.href = `https://genius.com/search?q=${encodeURIComponent(query)}`;

    // Keep the progress bar moving between polls
    if (playing && !this._tickTimer) this._tickTimer = setInterval(() => this.tick(), 1000);
    if (!playing) {
      clearInterval(this._tickTimer);
      this._tickTimer = null;
    }
  }

  /** Fills the inline label; when it overflows, turns it into a looping marquee. */
  setLabel(html) {
    const label = this.refs.label;
    label.classList.remove("scrolling");
    label.innerHTML = `<span class="np-marquee"><span class="np-marquee-copy">${html}</span></span>`;
    const copy = label.querySelector(".np-marquee-copy");
    const width = copy.getBoundingClientRect().width;
    if (width <= label.clientWidth + 1) return;

    const gap = 32;
    const marquee = label.firstElementChild;
    marquee.insertAdjacentHTML("beforeend", `<span class="np-marquee-copy" aria-hidden="true">${html}</span>`);
    const shift = width + gap;
    marquee.style.setProperty("--np-marquee-gap", `${gap}px`);
    marquee.style.setProperty("--np-marquee-shift", `${shift}px`);
    // ~30px/s while moving, plus the pause at the start (18% of the cycle)
    marquee.style.setProperty("--np-marquee-dur", `${(shift / 30 / 0.82).toFixed(1)}s`);
    label.classList.add("scrolling");
  }

  tick() {
    if (!this.track) return;
    const position = this.position();
    const duration = this.track.duration;
    this.refs.elapsed.textContent = this.formatTime(position);
    this.refs.bar.style.width = duration ? `${Math.min(100, (position / duration) * 100)}%` : "0";
  }

  disconnectedCallback() {
    this._listeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler));
    clearTimeout(this._pollTimer);
    clearInterval(this._tickTimer);
  }

  async connectedCallback() {
    await this.render();
    this.setEvents();
    this.poll();
  }
}
