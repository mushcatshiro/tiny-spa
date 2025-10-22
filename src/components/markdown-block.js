import { marked } from "../frozen/marked.js";

export class MarkdownBlockComponent {
  constructor(
    targetElementId,
    markdownFilePath
  ) {
    this.targetElementId = targetElementId
    this.markdownFilePath = markdownFilePath
    this.init()
  }
  async init() {
    const text = await fetch(this.markdownFilePath).then(r => r.text())
    const html = marked(text)

    const container = document.querySelector(this.targetElementId)
    container.innerHTML = html
  }
}

export default MarkdownBlockComponent