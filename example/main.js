// router.js
import SpaFramework from 'tiny-spa/router.js';
import { HomeController } from './pages/home.js';
import { AboutController } from './pages/about.js';
import { ContactController } from './pages/contact.js';
import { ExampleTableController } from './pages/example-table.js'
import { ExampleScatterChartController } from './pages/example-scatter.js';
import { ExampleHttpRequestController } from './pages/example-http-request.js';
import { ExampleMdController } from './pages/example-md.js';

// Instantiate the framework
const router = new SpaFramework();

// Register all the pages/routes
router.registerRoute('/', './pages/home.html', HomeController);
router.registerRoute('/about', './pages/about.html', AboutController);
router.registerRoute('/contact', './pages/contact.html', ContactController)
router.registerRoute('/example-table', './pages/example-table.html', ExampleTableController)
router.registerRoute('/example-scatter', './pages/example-scatter.html', ExampleScatterChartController)
router.registerRoute('/example-http-request', './pages/example-http-request.html', ExampleHttpRequestController)
router.registerRoute('/example-md', './pages/example-md.html', ExampleMdController)

// Export the router instance for potential use elsewhere, though it's self-running
export default router;