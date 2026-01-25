const RenderedComponents = {};

/**
 * Base Component class extending HTMLElement.
 * Provides a structure for creating Web Components with shadow DOM,
 * style management, and convenient DOM referencing.
 *
 * @extends {HTMLElement}
 */
class Component extends HTMLElement {
  /**
   * Object to store references to DOM elements within the shadow root.
   * Keys are reference names, values are selector strings initially,
   * and become DOM elements (or collections) after `render()` is called.
   * @type {Object.<string, string>}
   */
  refs = {};

  /**
   * Pre-defined resource links for fonts, icons, and libraries.
   * Can be returned in the `imports()` method to include them in the component.
   */
  resources = {
    fonts: {
      roboto: '<link href="https://fonts.googleapis.com/css?family=Roboto:100,400,700" rel="stylesheet">',
      nunito: '<link href="https://fonts.googleapis.com/css?family=Nunito:200" rel="stylesheet">',
      raleway: '<link href="https://fonts.googleapis.com/css?family=Raleway:600" rel="stylesheet">',
    },
    icons: {
      material:
        '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">',
      cryptofont: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/monzanifabio/cryptofont/cryptofont.css">',
      tabler: '<link rel="stylesheet" href="src/css/tabler-icons.min.css">',
    },
    libs: {
      awoo: '<link rel="stylesheet" type="text/css" href="src/css/awoo.min.css">',
    },
  };

  /**
   * Initializes the component and attaches a Shadow DOM.
   */
  constructor() {
    super();

    this.shadow = this.attachShadow({
      mode: "open",
    });
  }

  /**
   * Returns the CSS styles for the component.
   * Should be overridden by subclasses.
   * @returns {string|null} CSS string or null
   */
  style() {
    return null;
  }

  /**
   * Returns the HTML template for the component.
   * Should be overridden by subclasses.
   * @returns {string|Promise<string>|null} HTML string or null
   */
  template() {
    return null;
  }

  /**
   * Returns a list of resources to import (e.g., fonts, icons).
   * Should be overridden by subclasses.
   * @returns {Array<string>} Array of HTML link strings
   */
  imports() {
    return [];
  }

  /**
   * Reference an external CSS file.
   * OBS: External style loading not yet fully supported with web components, causes flickering.
   * @param {string} path - Path to the CSS file
   */
  set stylePath(path) {
    this.resources.style = `<link rel="preload" as="style" href="${path}" onload="this.rel='stylesheet'">`;
  }

  /**
   * Return all the imports that a component requested.
   * @returns {Array<string>} imports
   */
  get getResources() {
    const imports = this.imports();

    if (this.resources?.style) imports.push(this.resources.style);

    return imports;
  }

  /**
   * Return inline style tag combined with imported resources.
   * @returns {Promise<string>} HTML string containing styles and links
   */
  async loadStyles() {
    let html = this.getResources.join("\n");

    if (this.style()) html += `<style>${this.style()}</style>`;

    return html;
  }

  /**
   * Build the component's HTML body by combining styles and template.
   * @returns {Promise<string>} Full HTML content for the shadow root
   */
  async buildHTML() {
    return (await this.loadStyles()) + (await this.template());
  }

  /**
   * Create a reference Proxy for manipulating DOM elements.
   * Allows accessing elements via `this.refs.refName` directly.
   *
   * - Getting `this.refs.name` returns the DOM element(s) matching the selector.
   * - Setting `this.refs.name = "content"` updates the `innerHTML` of that element.
   *
   * @returns {Proxy} A proxy wrapping the refs object
   */
  createRef() {
    return new Proxy(this.refs, {
      get: (target, prop) => {
        const ref = target[prop];
        const elems = this.shadow.querySelectorAll(ref);

        if (elems.length > 1) return elems;

        const element = elems[0];

        if (!element) return ref;

        return element;
      },
      set: (target, prop, value) => {
        this.shadow.querySelector(target[prop]).innerHTML = value;
        return true;
      },
    });
  }

  /**
   * Renders the component by building HTML and setting up references.
   * Stores the instance in RenderedComponents.
   * @returns {Promise<void>}
   */
  async render() {
    this.shadow.innerHTML = await this.buildHTML();
    this.refs = this.createRef();
    RenderedComponents[this.localName] = this;
  }
}
