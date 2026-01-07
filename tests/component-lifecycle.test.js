// tests/component-lifecycle.test.js
import { setupDomShim } from './mocks/dom-shim.js';
import { BaseComponent } from '../src/components/baseComponent.js';

setupDomShim();

class TestComponent extends BaseComponent {
  constructor(cid) {
    super(cid);
    this.mounted = false;
    this.unmounted = false;
  }
  async onMount() {
    await super.onMount();
    this.mounted = true;
  }
  async onUnmount() {
    this.unmounted = true;
    await super.onUnmount();
  }
}

const mockContainer = {
  innerHTML: '',
  prepend() {},
  querySelector() { return null; }
};
global.__setDocumentElement('comp1', mockContainer);

describe('Component Lifecycle', () => {
  it('should set mounted flag on onMount', async () => {
    const comp = new TestComponent('comp1');
    await comp.onMount();
    expect(comp.mounted).toBe(true);
  });

  it('should set unmounted flag on onUnmount', async () => {
    const comp = new TestComponent('comp1');
    await comp.onMount();
    await comp.onUnmount();
    expect(comp.unmounted).toBe(true);
  });

  it('should create style tag if customCss provided', async () => {
    const comp = new TestComponent('comp1');
    comp.customCss = 'div { color: red; }';
    await comp.onMount();
    expect(comp.styleTag).toBeTruthy();
    expect(comp.styleTag.textContent).toContain('color: red');
  });
});
