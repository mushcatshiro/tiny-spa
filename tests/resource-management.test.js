// tests/resource-management.test.js
import { setupDomShim } from './mocks/dom-shim.js';
import { BaseComponent } from '../src/components/baseComponent.js';

setupDomShim();

const mockElement = {
  addEventListener() {},
  removeEventListener() {}
};
const mockContainer = {
  querySelector() { return mockElement; }
};
global.__setDocumentElement('res1', mockContainer);

describe('Resource Management', () => {
  let comp;

  beforeEach(() => {
    comp = new BaseComponent('res1');
  });

  it('should track and remove event listeners', () => {
    let called = false;
    const handler = () => { called = true; };

    comp.addListener('button', 'click', handler);
    comp.removeAllResources();

    // We can't trigger event, but we can check cleanup
    expect(comp._eventListeners.length).toBe(0);
  });

  it('should clear timeouts and intervals', () => {
    let timeoutCalled = false;
    let intervalCalled = false;

    comp.addTimeout(() => { timeoutCalled = true; }, 1);
    comp.addInterval(() => { intervalCalled = true; }, 1);

    expect(comp._timers.length).toBe(1);
    expect(comp._intervals.length).toBe(1);

    comp.removeAllResources();

    expect(comp._timers.length).toBe(0);
    expect(comp._intervals.length).toBe(0);
  });

  it('should abort fetch requests via abortController', async () => {
    await comp.onMount();
    expect(comp.abortController).toBeTruthy();

    comp.removeAllResources();
    expect(comp.abortController).toBe(null);
  });
});
