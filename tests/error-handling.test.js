// tests/error-handling.test.js
import { setupDomShim } from './mocks/dom-shim.js';
import { SpaError, DefaultErrorController } from '../src/baseController.js';

setupDomShim();

const mockAppEl = { innerHTML: '' };
global.__setDocumentElement('app', mockAppEl);

describe('Error Handling', () => {
  it('should create SpaError with code', () => {
    const err = new SpaError('Not found', 404);
    expect(err.message).toBe('Not found');
    expect(err.code).toBe(404);
  });

  it('should render error view with stack trace', () => {
    DefaultErrorController.formatStackFlag = true;
    DefaultErrorController.projectIdentifier = 'src';

    const controller = new DefaultErrorController('app');
    controller.setData({
      code: 500,
      message: 'Server error',
      stack: `Error: test
    at someFunction (src/utils.js:10:5)
    at node_modules/axios/index.js:1:1`
    });

    controller.render();

    expect(mockAppEl.innerHTML).toContain('Server error');
    expect(mockAppEl.innerHTML).toContain('src/utils.js');
    expect(mockAppEl.innerHTML).not.toContain('node_modules');
  });

  it('should render without stack if formatStackFlag is false', () => {
    DefaultErrorController.formatStackFlag = false;
    const controller = new DefaultErrorController('app');
    controller.setData({ code: 404, message: 'Not found', stack: '...' });
    controller.render();
    expect(mockAppEl.innerHTML).toContain('...');
  });
});
