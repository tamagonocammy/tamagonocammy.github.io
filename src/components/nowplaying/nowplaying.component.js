/**
 * Now Playing Component.
 * Shows the track playing in Apple Music, read from the local helper in tools/nowplaying
 * (a browser page can't see Music.app on its own). Click (or the `m` shortcut) opens a popup
 * with artwork, progress and playback controls.
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
  };

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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
      }

      .np-artist {
          margin-top: 2px;
          font: 400 8.5pt 'Lato', sans-serif;
          color: ${CONFIG.palette.subtext0};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
          gap: 14px;
          margin-top: 8px;
      }

      .np-controls button {
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
      .np-controls button:focus-visible {
          background: ${CONFIG.palette.surface0};
          color: ${CONFIG.palette.pink};
          outline: none;
      }

      .np-controls button:active {
          transform: scale(.88);
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
            <button class="np-prev" data-action="previous" title="${this.t("previous", "Previous")}"><i class="ti ti-player-skip-back"></i></button>
            <button class="np-playpause" data-action="playpause" title="${this.t("pause", "Pause")}"><i class="ti ti-player-pause"></i></button>
            <button class="np-next" data-action="next" title="${this.t("next", "Next")}"><i class="ti ti-player-skip-forward"></i></button>
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
    label.innerHTML = `<strong>${this.escape(track.title)}</strong>${
      track.artist ? ` <span class="np-label-artist">· ${this.escape(track.artist)}</span>` : ""
    }`;
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

    // Keep the progress bar moving between polls
    if (playing && !this._tickTimer) this._tickTimer = setInterval(() => this.tick(), 1000);
    if (!playing) {
      clearInterval(this._tickTimer);
      this._tickTimer = null;
    }
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
