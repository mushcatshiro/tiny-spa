/**
  * @typedef { Object } responseObj
  * @property { number } code
  * @property { string } headers
  * @property { Object } body
  */

export class HttpRequest {
  /**
    * @param { string } method
    * @param { string } url
    * @param { Object } payload
    * @param { string } formElmId
    * @param { Object } headers
    */
  constructor(
    method,
    url,
    payload = null,
    formElmId = "",
    headers = { 'Content-Type': 'application/json' }
  ) {
    this.method = method;
    this.url = url;
    this.payload = payload;
    this.formElmId = formElmId;
    this.headers = headers
  }

  async execute(signal) {
    try {
      const options = {
        method: this.method,
        headers: this.headers,
        signal: signal,
      }
      if (this.payload) {
        options.body = JSON.stringify(this.payload)
      }

      const response = await fetch(this.url, options)
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      const result = await response.json()
      return result
    } catch (error) {
      if (error.name === 'AbortError') {
        return { aborted: true }
      }
      console.error('HttpRequets failed:', error)
      throw error  // TOOD: do better
    }
  }

  async executeFormData() {
    // TODO: separate
    if (this.formElmId === "") {
      throw new Error(`Form Element ID does not exists: ${this.formElmId}`);
    }
    const form = document.querySelector(this.formElmId)
    this.payload = new FormData(form)
    await this.execute()
  }

  async executeStreamResponse() {
    // TODO: separate
  }
}

export class MockHttpRequest extends HttpRequest {
  /**
    * @param { string } method
    * @param { string } url
    * @param { object } payload
    * @param { object } headers
    * @param { number } delay
    * @param { responseObj } response
    */
  constructor(method, url, payload, headers, delay, response) {
    super(method=method, url=url, payload=payload, headers=headers);
    this.response = response
    this.delay = delay
  }

  /**
    * @return { Promise<responseObj> }
    */
  async execute() {
    await new Promise(resolve => setTimeout(resolve, this.delay));
    return this.response
  }
}

