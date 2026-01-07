// tests/routing.test.js
import { setupDomShim } from './mocks/dom-shim.js';
import TinySpa from '../src/router.js';
import { BaseController, DefaultErrorController } from '../src/baseController.js';

setupDomShim();

class MockController extends BaseController {
  render() {
    const el = document.getElementById(this.appId);
    if (el) el.innerHTML = '<div>Mock Page</div>';
  }
}

// Mock document element
const mockAppEl = { innerHTML: '', prepend() {} };
global.__setDocumentElement('app', mockAppEl);

// Mock fetch
let mockFetchImpl;
global.__mockFetch = (url, options) => mockFetchImpl(url, options);

describe('Routing', () => {
  beforeEach(() => {
    mockAppEl.innerHTML = '';
    window.location.hash = '';
  });

  it('should render controller when route matches', async () => {
    const router = new TinySpa('app');

    router.loadPageStyles = () => Promise.resolve();

    mockFetchImpl = () => Promise.resolve({ ok: true, text: () => Promise.resolve('<div>Page</div>') });

    router.registerRoute('/test', './pages/test.html', MockController);
    window.location.hash = '#/test';

    await router.handleRouteChange();

    expect(mockAppEl.innerHTML).toContain('Mock Page');
    expect(router.currentController).toBeInstanceOf(MockController);
  });

  it('should render DefaultErrorController for invalid route', async () => {
    const router = new TinySpa('app');
    router.loadPageStyles = () => Promise.resolve();

    window.location.hash = '#/invalid';

    await router.handleRouteChange();

    expect(mockAppEl.innerHTML).toContain('Error: 404');
    expect(router.currentController).toBeInstanceOf(DefaultErrorController);
  });

  it('should handle fetch failure gracefully', async () => {
    const router = new TinySpa('app');
    router.loadPageStyles = () => Promise.resolve();
    mockFetchImpl = () => Promise.resolve({ ok: false, status: 404 });

    router.registerRoute('/fail', './pages/fail.html', MockController);
    window.location.hash = '#/fail';

    await router.handleRouteChange();

    expect(mockAppEl.innerHTML).toContain('Error: 404');
  });

  /**
  it('should abort previous navigation when new route starts', async () => {
    const router = new TinySpa('app');
    router.loadPageStyles = () => Promise.resolve(); // Mock to avoid hanging

    let fetchCallCount = 0;
    mockFetchImpl = (url, { signal }) => {
      fetchCallCount++;
      return new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
        // Hang unless aborted
      });
    };

    router.registerRoute('/test', './pages/test.html', MockController);

    window.location.hash = '#/test';
    const first = router.handleRouteChange();

    window.location.hash = '#/test';
    const second = router.handleRouteChange();

    await first; // Should resolve to undefined
    await second; // Should succeed

    expect(fetchCallCount).toBe(2);
  });
  **/
});
