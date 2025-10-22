// spa-framework.js

/**
 * @class SpaFramework
 * @description A minimal framework for building Single Page Applications.
 */
class TinySpa{
  constructor() {
    this.routes = {};
    this.currentController = null;
    // Listen for hash changes to handle routing
    window.addEventListener('hashchange', () => this.handleRouteChange());
    // Handle initial page load
    window.addEventListener('load', () => this.handleRouteChange());
  }

  /**
   * Registers a route.
   * @param {string} path - The URL path (e.g., '/home').
   * @param {string} templateUrl - The path to the HTML template file.
   * @param {Function} controller - The controller function to execute for this route.
   */
  registerRoute(path, templateUrl, controller) {
    this.routes[path] = { templateUrl, controller };
  }

  /**
   * Handles the route change based on the URL hash.
   */
  async handleRouteChange() {
    console.log("test")
    if (this.currentController && typeof this.currentController.onUnmount === "function") {
      await this.currentController.onUnmount();
    }
    this.currentController = null

    const path = window.location.hash.slice(1) || '/';
    const route = this.routes[path];

    if (!route) {
      if (this.routes["/404"]) {
        this.renderView(path, route)
      } else {
        this.renderView('<h1>404 - Not Found</h1>', "");
      } 
    }
    try {
      this.renderView(path , route);

      // Execute the controller
      if (typeof route.controller === 'function') {
        this.currentController = new route.controller();
        await this.currentController.onMount()
        // The controller's constructor can handle initial data loading
      }
    } catch (error) {
      console.error('Error handling route change:', error);
      this.renderView('<h1>Error: Page not found</h1>', "");
    }
  }

  /**
   * Renders the HTML content into the main app container.
   * @param {string} path - url path to be rendered
   * @param {any} route - path to HTML file
   */
  async renderView(path, route) {
    // Fetch the HTML template
    const response = await fetch(route.templateUrl);
    if (!response.ok) throw new Error(`Failed to fetch template: ${route.templateUrl}`);
    const html = await response.text();

    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = html;
      this.loadPageStyles(route.templateUrl);
    } else {
      console.error('App container with id "app" not found.');
    }
  }

  /**
   * Removes the currently active page-specific stylesheet.
   */
  unloadPageStyles() {
    const currentStyle = this.existingPageStyle();
    if (currentStyle) {
      document.head.removeChild(currentStyle);
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
}

export default TinySpa