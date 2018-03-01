# Unified todomvc benchmark

Todomvcs generated for react, preact, inferno without and with redux, [mobx](https://mobx.js.org) and [reactive-di](https://github.com/zerkalica/reactive-di) state managent libraries from one source.

Open [all todomvc](https://zerkalica.github.com/utb)

or run locally:

1. npm install
2. npm run build && npm start
3. open http://localhost:8080

Build single library target:

```
COMPONENT_LIB=preact STATE_LIB=lom_atom--reactive-di npm run build
```
