export class BaseComponent {
  /**
    * @param { string } cid
    * @param { string | null } customCss
    */
  constructor(cid, customCss=null) {
    this.cid = cid;
    this.customCss = customCss;
    this.styleTag = null;
    this.defaultCss = null;
  }

  async onMount() {
    const cssToLoad = this.customCss ? this.customCss : this.defaultCss;
    if (cssToLoad) {
      this.styleTag = document.createElement('style');
      this.styleTag.id = `style-${this.cid}`;
      this.styleTag.textContent = cssToLoad;
      // TODO: using scope and limit to the cid block
      document.head.appendChild(this.styleTag);
    }
  }

  async onUnmount() {
    if (this.styleTag) {
      this.styleTag.remove();
      this.styleTag = null;
    }
  }
}
