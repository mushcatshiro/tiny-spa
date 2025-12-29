// spa-framework.js

import { BaseController, DefaultErrorController } from './baseController.js'

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
   * Handles the route change based on the URL hash.
   */
  async handleRouteChange() {
    if (this.currentController) {
      await this.currentController.onUnmount();
    }
    this.currentController = null

    const path = window.location.hash.slice(1) || '/';
    const routeObj = this.routes[path];

    try {
      const response = await fetch(routeObj.templateUrl);
      if (!response.ok) throw new Error(`Failed to fetch template: ${routeObj.templateUrl}`);
      const html = await response.text();
      const appContainer = document.getElementById('app');
      if (appContainer) {
        appContainer.innerHTML = html;
        this.loadPageStyles(routeObj.templateUrl);
      } else {
        console.error('App container with id "app" not found.');
      }
    } catch (err) {
      this.handleRoutingError(path);
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
  function registerError(errMsg, errorCode=404) {
    return
  }
}

class SpaError extends Error {
  /**
    * @param{ string } message
    * @param{ number } code
    */
  constructor(message, code=404) {
    super(message);
    this.errorCode = code
  }
}

export default TinySpa
