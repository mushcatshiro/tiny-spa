import SpaFramework from '../src/router.js';
import { BaseController, DefaultErrorController } from '../src/baseController.js';
import { suite, test, assert } from './test-runner.js';

suite('Router Validation', () => {
    const router = new SpaFramework();

    test('should accept a valid subclass of BaseController', () => {
        class GoodController extends BaseController {}
        router.registerRoute('/home', '/home.html', GoodController);

        assert.strictEqual(router.routes['/home'].controller, GoodController);
    });

    test('should fallback to DefaultErrorController for invalid controllers', () => {
        class BadClass {} // Doesn't extend BaseController
        router.registerRoute('/bad', '/bad.html', BadClass);

        // Assert that the router protected itself
        assert.strictEqual(router.routes['/bad'].controller, DefaultErrorController);
    });
});
