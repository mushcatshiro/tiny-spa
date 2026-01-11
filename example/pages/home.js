import { BaseController  } from 'tiny-spa/baseController.js'
import { ChartComponent } from './simple-bar.js'

export class HomeController extends BaseController {
  constructor(appId) {
    super(appId)
    this.components.push(new ChartComponent())
  }

  async onMount() {
    super.onMount();
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
    });
    // here
  }

  async onUnmount() { super.onUnmount() };
}
