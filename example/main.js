import TinySpa from 'tiny-spa/router.js';
import { HomeController } from './pages/home.js';
import { VectorVizController } from './pages/example-quiver.js'
import { ContactController } from './pages/contact.js';
/*
import { AboutController } from './pages/about.js';

import { ExampleTableController } from './pages/example-table.js'
import { ExampleScatterChartController } from './pages/example-scatter.js';
import { ExampleHttpRequestController } from './pages/example-http-request.js';
import { ExampleMdController } from './pages/example-md.js';
*/

const router = new TinySpa();

router.registerRoute('/', './pages/home.html', HomeController);
router.registerRoute('/vector-viz', './pages/example-quiver.html', VectorVizController);
// router.registerRoute('/about', './pages/about.html', AboutController);
router.registerRoute('/contact', './pages/contact.html', ContactController)
// router.registerRoute('/example-table', './pages/example-table.html', ExampleTableController)
// router.registerRoute('/example-scatter', './pages/example-scatter.html', ExampleScatterChartController)
// router.registerRoute('/example-http-request', './pages/example-http-request.html', ExampleHttpRequestController)
// router.registerRoute('/example-md', './pages/example-md.html', ExampleMdController)

// Export router instance at global level for code block rendering
window.app = router;

// Export router instance at module level
export default router;
