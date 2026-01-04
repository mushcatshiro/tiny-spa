import { BaseController  } from 'tiny-spa/baseController.js'

export class HomeController extends BaseController {
  constructor(appId) { super(appId) }

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

      /* NOT tested
      const previewContainer = document.createElement('div');
      previewContainer.className = 'live-preview-box';
      previewContainer.style.border = '1px solid #ccc';
      previewContainer.style.padding = '1rem';
      previewContainer.style.marginTop = '0.5rem';
      previewContainer.style.marginBottom = '2rem';
      previewContainer.innerHTML = '<small style="color:#888">Live Preview:</small><div class="mount-point"></div>';
      block.parentNode.insertBefore(previewContainer, block.nextSibling);

      const code = block.innerText;
      const mountPoint = previewContainer.querySelector('.mount-point');

      try {
        // We pass 'container' as a variable so the code block can use it
        // e.g., TinySPA.render('<h1>Hi</h1>', container)
        const runner = new Function('container', 'TinySPA', code);
        runner(mountPoint, window.app);
      } catch (err) {
        mountPoint.innerHTML = `<pre style="color:red">Error: ${err.message}</pre>`;
      }
      */
    });
    document.querySelectorAll('iframe').forEach(block => {
      block.height = block.contentWindow.document.body.scrollHeight + "px";
    });
  }
}
