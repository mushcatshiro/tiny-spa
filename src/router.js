import { BaseController, DefaultErrorController, SpaError } from './baseController.js'

/**
  * @typedef { Object } routeObj
  * @property { string } templateUrl
  * @property { typeof BaseController } controller
  */

/**
  * @class TinySpa
  * @description A minimal framework for building Single Page Applications.
  */
class TinySpa{
  /**
    * @param { string } appId
    */
  constructor(appId="app") {
    /**
      * @type { Object.<string, routeObj> }
      */
    this.routes = {};
    /**
      * @type { BaseController | null }
      */
    this.currentController = null;
    this.appId = appId
    this.routingAbortController = null;
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  /**
   * @param { string } path
   * @param { string } templateUrl
   * @param { typeof BaseController } controller
   */
  registerRoute(path, templateUrl, controller) {
    const isValidController = controller &&
      (controller === BaseController || controller.prototype instanceof BaseController);
    const isValidUrl = typeof templateUrl === 'string' &&
      templateUrl.startsWith('./') && templateUrl.length > 0;
    if (!isValidController || !isValidUrl) {
      templateUrl = ""
      controller = DefaultErrorController
    }
    this.routes[path] = { templateUrl, controller };
  }

  async handleRouteChange() {
    if (this.routingAbortController) {
      this.routingAbortController.abort()
    }

    const abortController = new AbortController();
    this.routingAbortController = abortController;
    const signal = abortController.signal;
    try {
      if (this.currentController) await this.currentController.onUnmount();
      this.currentController = null

      const path = window.location.hash.slice(1) || '/';
      const routeObj = this.routes[path];
      if (!routeObj) throw new SpaError(`Route not found`)

      const response = await fetch(routeObj.templateUrl, { signal });
      if (signal.aborted) return;
      if (!response.ok) throw new SpaError(`Failed to fetch template: ${routeObj.templateUrl}`)

      const html = await response.text();

      const appContainer = document.getElementById(this.appId);
      if (!appContainer) throw new SpaError(`Failed to identify app container with id "app".`)

      appContainer.innerHTML = html;
      await this.loadPageStyles(routeObj.templateUrl);
      this.currentController = new routeObj.controller(this.appId);
      this.currentController.render()
      await this.currentController.onMount()
    } catch (err) {
      if (err.name === "AbortError") {
        return
      }
      //console.log(err)
      this.renderError(err);
    }
  }

  unloadPageStyles() {
    const currentStyle = this.existingPageStyle();
    if (currentStyle) {
      currentStyle.remove()
    }
  }

  existingPageStyle() {
    return document.head.querySelector('link[data-page-style]');
  }

  /**
    * @param { string } templateUrl
    * @returns { Promise<void> }
    */
  async loadPageStyles(templateUrl) {
    this.unloadPageStyles();
    const cssHref = templateUrl.replace('.html', '.css');
    if (!cssHref) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      link.dataset.pageStyle = "true";
      link.onload = () => resolve();
      //link.onerror = () => reject(new SpaError(`Failed to load css ${cssHref}`));
      link.onerror = () => {
        link.remove();
        resolve();
      }
      document.head.appendChild(link);
    });
  }

  /**
    * @param { Error | SpaError } err
    */
  renderError(err) {
    /**
      * @type { SpaError }
      */
    const error = err instanceof SpaError
      ? err
      : new SpaError(err.message, 500);  // what's the err.message?
    if (!(error instanceof SpaError)) {
      error.stack = err.stack;
    }
    const errorController = new DefaultErrorController(this.appId);
    this.currentController = errorController.setData(error);
    this.currentController.render()
  }
}


export default TinySpa
