// tests/mocks/dom-shim.js
export function setupDomShim() {
  if (typeof window !== 'undefined') return;

  global.window = {
    location: {
      hash: '',
      assign() {},
    },
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const elements = new Map();

  global.document = {
    createElement(tag) {
      return { tagName: tag.toUpperCase(), textContent: '', innerHTML: '', dataset: {}, style: {}, appendChild() {}, remove() {} };
    },
    getElementById(id) {
      return elements.get(id) || { innerHTML: '', prepend() {}, querySelector() { return null; } };
    },
    head: {
      querySelector() { return null; },
      appendChild() {},
    },
    write() {},
  };

  // Allow test to inject elements
  global.__setDocumentElement = (id, element) => {
    elements.set(id, element);
  };

  global.fetch = async (url, options) => {
    if (global.__mockFetch) {
      return global.__mockFetch(url, options);
    }
    throw new Error(`fetch not mocked for ${url}`);
  };

  global.setTimeout = (fn, ms) => {
    Promise.resolve().then(() => fn());
    return 1;
  };
  global.clearTimeout = () => {};
  global.setInterval = () => 2;
  global.clearInterval = () => {};

  // AbortController polyfill if needed (Bun has it, but just in case)
  if (typeof AbortController === 'undefined') {
    global.AbortController = class {
      constructor() {
        this.signal = {
          aborted: false,
          listeners: [],
          addEventListener(type, fn) {
            if (type === 'abort') this.listeners.push(fn);
          },
          removeEventListener(type, fn) {
            if (type === 'abort') {
              this.listeners = this.listeners.filter(f => f !== fn);
            }
          }
        };
        this.abort = () => {
          this.signal.aborted = true;
          this.signal.listeners.forEach(fn => fn());
        };
      }
    };
  }
}
