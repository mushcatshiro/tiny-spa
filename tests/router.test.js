import TinySpa from '../src/router.js';
import { BaseController, DefaultErrorController } from '../src/baseController.js';
import { suite, test, assert } from './test-runner.js';

suite('Router Validation', async () => {
    await test('should accept a valid subclass of BaseController', async () => {
      const router = new TinySpa();
      class GoodController extends BaseController {}
      router.registerRoute('/home', '/home.html', GoodController);
      assert.strictEqual(router.routes['/home'].controller, GoodController);
    });

    await test('should fallback to DefaultErrorController for invalid templateUrl', async () => {
      const router = new TinySpa();
      class GoodController extends BaseController {}
      router.registerRoute('/invalidTmplUrl', 'invalidTmplUrl.html', GoodController);
      assert.strictEqual(router.routes['/invalidTmplUrl'].controller, DefaultErrorController);
    });

    await test('should fallback to DefaultErrorController for invalid controllers', async () => {
      const router = new TinySpa();
      class BadClass {}
      router.registerRoute('/bad', '/bad.html', BadClass);
      assert.strictEqual(router.routes['/bad'].controller, DefaultErrorController);
    });


});

suite('Route Change', async () => {
  document.body.innerHTML = '<div id="app"></div>';
  window.fetch = (url) => Promise.resolve({
    ok: true,
    text: () => Promise.resolve(`<div>Content for ${url}</div>`)
  });
  class ControllerOne extends BaseController {}
  const router = new TinySpa();
  router.registerRoute('/one', '/fixtures/one.html', ControllerOne);

  await test('Should render template and mount controller when hash changes', async () => {
    window.location.hash = '/one';
    await router.handleRouteChange();
    const app = document.getElementById('app');
    assert.isTrue(app.innerHTML.includes('one.html'));
    assert.isTrue(router.currentController instanceof ControllerOne);
  });

})
