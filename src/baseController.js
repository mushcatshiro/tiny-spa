/**
  * @typedef { Object } errorObj
  * @property { number } code
  * @property { string } message
  * @property { string } trace
  */


export class BaseController {
  async onMount() {}
  async onUnmount() {}
}

export class DefaultErrorController extends BaseController {
  /**
    * @type { errorObj }
    */
  static lastError = null;
  async onMount() {
    const data = DefaultErrorController.lastError
    const targetElement = document.getElementById("app");
    targetElement.innerHTML =
      `<div><h2>${data.code}</h2><div>${data.message}</div><div>${data.trace}</div></div>`;
  }
}

