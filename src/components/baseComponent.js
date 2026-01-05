import { HttpRequest } from './http-request.js'

export class BaseComponent {
  /**
    * @param { string } cid
    * @param { string } customCss
    */
  constructor(cid, customCss="") {
    this.cid = cid;
    this.customCss = customCss;
    this.styleTag = null;
    this.defaultCss = "";
    this._eventListeners = []
    this._timers = [];
    this._intervals = [];
    this.abortController = new AbortController();
  }

  async onMount() {
    const cssToLoad = this.customCss ? this.customCss : this.defaultCss;
    if (cssToLoad) {
      this.styleTag = document.createElement('style');
      this.styleTag.textContent = `@scope { ${cssToLoad} }`;
      const container = document.getElementById(this.cid);
      container.prepend(this.styleTag);
    }
  }

  async onUnmount() {
    if (this.styleTag) {
      this.styleTag.remove();
      this.styleTag = null;
    }
  }

  addListener(elementId, eventType, handler) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const boundHandler = handler.bind(this);
    element.addEventListener(eventType, boundHandler);
    this._eventListeners.push({ element, eventType, boundHandler });
  }

  addTimeout(handler, delay) {
    const id = setTimeout(handler.bind(this), delay);
    this._timers.push(id);
    return id;
  }

  addInterval(handler, delay) {
    const id = setInterval(handler.bind(this), delay);
    this._intervals.push(id);
    return id;
  }

  async safeFetch(method, url, payload, headers) {
    const client = new HttpRequest(method, url, payload, headers=headers)
    const response = await client.execute(this.abortController)
    return response
  }

  removeAllResources() {
    while (this._eventListeners.length > 0) {
      const { element, eventType, boundHandler } = this._eventListeners.pop();
      element.removeEventListener(eventType, boundHandler);
    }

    this._timers.forEach(id => clearTimeout(id));
    this._timers = [];

    this._intervals.forEach(id => clearInterval(id));
    this._intervals = [];

    this.abortController.abort()
  }
}
