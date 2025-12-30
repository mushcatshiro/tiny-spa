// spa-framework.js

import { BaseController, DefaultErrorController, SpaError } from './baseController.js'

/**
  * @typedef { Object } routeObj
  * @property { string } templateUrl
  * @property { typeof BaseController } controller
  */

/**
 * @class SpaFramework
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
    const isValidController = controller && (controller === BaseController || controller.prototype instanceof BaseController);
    const isValidUrl = typeof templateUrl === 'string' && templateUrl.startsWith('/') && templateUrl.length > 0;
    if (!isValidController || !isValidUrl) {
      console.error(`[Router] Validation failed for ${path}. Routing to fallback`)
      templateUrl = ""
      controller = DefaultErrorController
    }
    this.routes[path] = { templateUrl, controller };
  }

  /**
   * @description Handles the route change based on the URL hash.
   */
  async handleRouteChange() {
    try {
      if (this.currentController) {
        await this.currentController.onUnmount();
      }
      this.currentController = null

      const path = window.location.hash.slice(1) || '/';
      const routeObj = this.routes[path];

      const response = await fetch(routeObj.templateUrl);
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
      // this.loadPageStyles(routeObj.templateUrl);
      this.currentController = new routeObj.controller();
      await this.currentController.onMount()
    } catch (err) {
      this.renderError(err);
    }
  }

  /**
   * Removes the currently active page-specific stylesheet.
   */
  unloadPageStyles() {
    const currentstyle = this.existingpagestyle();
    if (currentstyle) {
      document.head.removechild(currentstyle);
    }
  }

  existingPageStyle() {
    return document.head.querySelector('[data-page-style]')
  }

  /**
   * Loads a new stylesheet for a specific page.
   * @param {string} templateUrl - The name of the page (e.g., 'about').
   */
  loadPageStyles(templateUrl) {
    this.unloadPageStyles();

    // Create a new <link> element for the new page's CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${templateUrl.split('.html')[0]}.css`; // Assumes a file structure like /pages/about/about.css
    link.dataset.pageStyle = pageName;

    document.head.appendChild(link);
  }

  /**
    * @param{ string } errMsg
    * @param{ number } errorCode
  */
  registerError(errMsg, errorCode=404) {
    return
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
