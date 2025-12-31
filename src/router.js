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
  constructor() {
    /**
      * @type { Object.<string, routeObj> }
      */
    this.routes = {};
    /**
      * @type { BaseController | null }
      */
    this.currentController = null;
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  /**
   * Registers a route.
   * @param { string } path - The URL path (e.g., '/home').
   * @param { string } templateUrl - The path to the HTML template file.
   * @param { typeof BaseController } controller - The controller function to execute for this route.
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
    try {
      if (this.currentController) await this.currentController.onUnmount();
      this.currentController = null

      const path = window.location.hash.slice(1) || '/';
      const routeObj = this.routes[path];
      if (!routeObj) {
        this.renderError(
          new SpaError(`Route not found`)
        )
        return
      }
      console.log(`${routeObj.templateUrl}`)
      const [response] = await Promise.all([
        fetch(routeObj.templateUrl).then(r => {
          console.log("STEP 2: Fetch started and received response");
          return r;
        }),
        this.loadPageStyles(routeObj.templateUrl).catch(err => {
          console.warn(err.message);
          return null;
        })
      ]);
      console.log("STEP 3: Promise.all finished");
      if (!response.ok) {
        this.renderError(
          new SpaError(`Failed to fetch template: ${routeObj.templateUrl}`)
        )
        return
      }

      const html = await response.text();
      const appContainer = document.getElementById('app');
      if (!appContainer) {
        this.renderError(
          new SpaError(`Failed to identify app container with id "app".`)
        )
        return
      }
      appContainer.innerHTML = html;
      this.currentController = new routeObj.controller();
      await this.currentController.onMount()
    } catch (err) {
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
    * Loads a new stylesheet for a specific page.
    * @param {string} templateUrl - The name of the page (e.g., 'about').
    * @returns { Promise<void> }
    */
  async loadPageStyles(templateUrl) {
    this.unloadPageStyles();
    console.log(`${templateUrl}`)
    const cssHref = templateUrl.replace('.html', '.css');
    console.log(`${cssHref}`)
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
    DefaultErrorController.lastError = error;
    new DefaultErrorController().onMount();
  }
}



export default TinySpa
