# Tiny SPA

a minimal frontend framework to build internal tools.

## Features

- MSAL
- D3.js
  - [x] scatter
  - [ ] line
  - [ ] histogram
- easy forms
  - multi-stage forms
- [x] table
  - [x] search
- [x] http request
- [x] markdown
- [ ] code syntax highlighting
- [ ] dev tools
  - [x] hot reload
  - [x] merge examples with pages
  - [x] move `router.js`/`index.html` to examples?
  - [x] move `components` `frozen`, and `router.js` to `src/`
  - [ ] build `d3.js` and offer it as optional
  - [ ] remove all css? and simplify it
  - [ ] offers a way to replace css
- [ ] lifecycle
- [ ] reactivity
- [ ] layout
  - [ ] sidenav (full/float-ish basically a div box with a list on either side)
  - [ ] topnav

### ESM and UMD

docker build -t d3-bundler -f Dockerfile.d3build .
docker run --rm -v "%cd%:/output" d3-bundler

> to include d3, d3/@types, some markdown support

### Running Example With Docker

PROD:
cd ~/tiny-spa && docker build -t tiny-spa-example . -f example/Dockerfile
cd ~/tiny-spa && docker run -p 80:80 -t tiny-spa-example

DEV:
cd ~/tiny-spa && docker compose up

## TODO

- remove `object` (replace with better model)

## why component's lifecycle matters

js uses tracing garbage collection; however for cases where

```js
function mount() {
  const btn = document.getElementById("myBtn");
  btn.addEventListener("click", () => console.log("clicked!"));
}
```

the shorthand function `() => console.log("clicked!")` still has a reference,
the DOM element's event listener list holds it. hence it will not be gc-ed.
When `setInterval`, `window.addEventListener`, `fetch` with `AbortController`
and etc. is used, an `onUnmount`/cleanup logic is important to prevent
unexpected side effects.

```js
class Controller {
  constructor(id) {
    this.id = id;
    this.onClick = () => console.log(`Controller ${id} clicked`);
    document.body.addEventListener("click", this.onClick);
    console.log(`Controller ${id} mounted`);
  }
}

let ctr = null;

function navigate(id) {
  // Simulate navigating to a new page
  ctr = new Controller(id);
}

// Try this:
navigate(1); // create controller 1
navigate(2); // create controller 2
navigate(3); // create controller 3

console.log("Now click anywhere on the page!");
```

> think `with` statement in python

### MISC

answer why the double render of nav? because it is not awaited, still how
exactly?

how to handle async? throw and fallback. so router should have a default with
good enough error message,

- renderView
- load/unload style
- handlerRouteChange

