import { BaseController  } from 'tiny-spa/baseController.js'

export class HomeController extends BaseController {
  constructor() { super() }

  async onMount() {
    document.querySelectorAll('pre').forEach(block => {
    if (block.classList.contains("no-render")) {
      return
    }
    if (block.classList.contains("text")) {
      const script = block.querySelector('script');
      if (!script) return;

      const pre = document.createElement('pre');
      pre.textContent = script.innerHTML;
      block.replaceWith(pre)
      return
    }
    // render
  });
  }
}
