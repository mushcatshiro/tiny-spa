

export class HttpRequest {
  constructor(
    method,
    url,
    payload = null,
    formElmId = null,
    headers = { 'Content-Type': 'application/json' }
  ) {
    this.method = method;
    this.url = url;
    this.payload = payload;
    this.formElmId = formElmId;
    this.headers = headers
  }

  async execute() {
    // header support
    try {
      const options = {
        method: this.method,
        headers: this.headers
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
      console.error('HttpRequets failed:', error)
      throw error
    }
  }

  async executeFormData() {
    if (this.formElmId === "") {
      throw new Error(`Form Element ID does not exists: ${this.formElmId}`);
    }
    const form = document.querySelector(this.formElmId)
    this.payload = new FormData(form)
    await this.execute()
  }

  async executeStreamResponse() { }
}

export default HttpRequest