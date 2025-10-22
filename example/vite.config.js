import { defineConfig } from 'vite';
import { glob } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      'tiny-spa': path.resolve(__dirname, '../src')
    }
  },
  server: {
    // Watch for changes in your framework's src directory for hot reloading
    watch: {
      usePolling: true,
    },
    // We also need to make sure the server is accessible from outside the container
    host: '0.0.0.0',
    port: 4200,
    hmr: {
      host: '127.0.0.1',
      protocol: 'ws',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      // This is the key part. We are telling Vite/Rollup
      // to find all HTML files in the project, not just the root index.html.
      // This ensures our page templates are included in the build.
      input: Object.fromEntries(
        glob.sync(['*.html', 'pages/*.html']).map(file => [
          // This gives us a nice name for each entry, like 'pages/home'
          path.relative(
            '.',
            file.slice(0, file.length - path.extname(file).length)
          ),
          // This resolves the full path to the file
          fileURLToPath(new URL(file, import.meta.url))
        ])
      ),
    }
  }
});