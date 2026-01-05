import { BaseComponent } from './components/baseComponent.js'

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
  /**
    * @param { string } appId
    */
  constructor(appId) {
    /**
     * @type { BaseComponent[] }
     */
    this.components = []
    this.appId = appId
  }

  async onMount() {
    for (const comp of this.components) {
      await comp.onMount()
    }
  }

  async onUnmount() {
    for (const comp of this.components) {
      await comp.onUnmount()
    }
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
    * @param { string } appId
    */
  constructor(appId) {
    super(appId);
  }

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

  render() {
    const data = DefaultErrorController.lastError
    const targetElement = document.getElementById(this.appId);
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

export class FailedToRegisterController extends BaseController {
  constructor(appId) { super(appId) }
  render() {
    const targetElement = document.getElementById(this.appId);
    targetElement.innerHTML = `This page failed during route registering.`
  }
}
