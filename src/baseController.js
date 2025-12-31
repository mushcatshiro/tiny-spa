export class SpaError extends Error {
  /**
    * @param{ string } message
    * @param{ number } code
    */
  constructor(message, code=404) {
    super(message);
    this.code = code

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SpaError)
    }
  }
}

export class BaseController {
  constructor() {
    this.components = []
  }

  async onMount() {}

  async onUnmount() {
    this.components.forEach(comp => {
      comp.onUnmount();
    })
  }

  render() {}
}

/**
  * @class
  * @property { SpaError } lastError
  * @property { string } projectIdentifier
  * @property { boolean } formatStackFlag
  */
export class DefaultErrorController extends BaseController {
  static lastError = null;
  static projectIdentifier = ""
  static formatStackFlag = false

  /**
    * @param { string | null } stack
    */
  formatStack(stack) {
    if (!stack) return "No stack trace available"
    if (!DefaultErrorController.projectIdentifier) return stack
    return stack
      .split('\n')
      .filter(line => {
        if (!line.includes('at ')) return true;
        return line.includes(DefaultErrorController.projectIdentifier);
      })
      .join('\n')
      .replace(/at /g, '<b style="color: #ff6b6b;">at </b>');
  }

  async onMount() {
    const data = DefaultErrorController.lastError
    const targetElement = document.getElementById("app");
    const view = `
      <div class="error-container">
        <h2>Error: ${data.code}</h2>
        <p>><strong>${data.message}</strong></p>
        <pre
          style="background: #eee; padding: 10px; overflow: auto;"
        >${DefaultErrorController.formatStackFlag
            ? this.formatStack(data.stack) : data.stack}
        </pre>
      </div>
    `
    if (!targetElement) {
      document.write(view)
      return
    }
    targetElement.innerHTML = view;
  }
}

export class BaseComponent {
  /**
    * @param { string } cid
    * @param { string | null } customCss
    */
  constructor(cid, customCss=null) {
    this.cid = cid;
    this.customCss = customCss;
    this.styleTag = null;
    this.defaultCss = null;
  }

  async onMount() {
    const cssToLoad = this.customCss ? this.customCss : this.defaultCss;
    if (cssToLoad) {
      this.styleTag = document.createElement('style');
      this.styleTag.id = `style-${this.cid}`;
      this.styleTag.textContent = cssToLoad;
      document.head.appendChild(this.styleTag);
    }
  }

  async onUnmount() {
    if (this.styleTag) {
      this.styleTag.remove();
      this.styleTag = null;
    }
  }
}
