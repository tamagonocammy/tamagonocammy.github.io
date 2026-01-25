/**
 * Configuration manager class.
 * Handles loading, saving, and accessing application settings.
 *
 * Hierarchy of values:
 * 1. UserConfig (passed to constructor, high priority if overrideStorage is true)
 * 2. LocalStorage (persisted user changes)
 * 3. Defaults (fallback values)
 */
class Config {
  /**
   * Default configuration values.
   * Used when no value is found in LocalStorage or UserConfig.
   * @type {Object}
   */
  defaults = {
    overrideStorage: false,
    temperature: {
      location: "London",
      scale: "C",
    },
    clock: {
      format: "h:i p",
    },
    disabled: [],
    openLastVisitedTab: false,
    tabs: [],
  };

  config;

  /**
   * @param {Object} config - Initial user configuration object.
   * @param {Object} palette - Color palette object.
   * @returns {Proxy<Config>} A proxy that intercepts property sets to auto-save.
   */
  constructor(config, palette) {
    this.config = config;
    this.palette = palette;
    this.storage = new Storage("config");

    this.autoConfig();
    this.setKeybindings();
    this.save();

    // return a Proxy to intercept property assignments
    // so we can automatically save to localStorage when a setting changes
    return new Proxy(this, {
      ...this,
      __proto__: this.__proto__,
      set: (target, prop, value) => this.settingUpdatedCallback(target, prop, value),
    });
  }

  /**
   * Callback triggered by the Proxy when a property is set.
   * Updates the property and saves the config to storage.
   *
   * @param {Config} target - The Config instance.
   * @param {string|symbol} prop - The property being set.
   * @param {*} val - The new value.
   * @returns {boolean} True if assignment was successful.
   */
  settingUpdatedCallback(target, prop, val) {
    if (!(prop in target)) return false;

    Reflect.set(target, prop, val);
    Object.assign(this, target);

    this.save();

    return true;
  }

  /**
   * Initializes config values.
   * Prioritizes UserConfig if overrideStorage is true, then LocalStorage, then Defaults.
   * @returns {void}
   */
  autoConfig() {
    Object.keys(this.defaults).forEach((setting) => {
      if (this.canOverrideStorage(setting)) this[setting] = this.config[setting];
      else if (this.storage.hasValue(setting)) this[setting] = this.storage.get(setting);
      else this[setting] = this.defaults[setting];
    });
  }

  /**
   * Determines whether the localStorage value should be overridden by the UserConfig.
   * Logic:
   * - If the setting exists in UserConfig AND
   * - (overrideStorage is true OR the setting is 'tabs' (tabs always sync from file))
   *
   * @param {string} setting - The setting key to check.
   * @returns {boolean}
   */
  canOverrideStorage(setting) {
    return setting in this.config && (this.config.overrideStorage || setting === "tabs");
  }

  /**
   * Prepares the object for JSON serialization.
   * Removes internal properties like `defaults` to keep the saved JSON clean.
   * @returns {Object} Clean configuration object.
   */
  toJSON() {
    return {
      ...this,
      defaults: undefined,
    };
  }

  /**
   * Sets up global keybinding listeners.
   * Activates actions defined in `config.keybindings`.
   * @returns {void}
   */
  setKeybindings() {
    document.onkeypress = ({ key }) => {
      if (document.activeElement !== document.body) return;

      if (Object.keys(this.config.keybindings).includes(key)) Actions.activate(this.config.keybindings[key]);
    };
  }

  /**
   * Persists the current configuration to LocalStorage.
   */
  save() {
    this.storage.save(stringify(this));
  }
}
