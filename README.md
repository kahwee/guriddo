# guriddo

Wrapper around SlickGrid 2.2 that adds frozen columns.

## Install and use

The original distribution uses Bower. Install this checkout's Bower dependencies,
then load SlickGrid, `guriddo.css`, and `guriddo.js` in your page:

```sh
bower install
```

```js
const grid = new Guriddo.WithFrozen('#grid', data, columns, {
  frozenColumn: true,
  enableColumnReorder: false
})
```

See [examples/basic.html](examples/basic.html) and
[examples/basic.js](examples/basic.js) for the full dependency order and data.
The historical Bower/Grunt toolchain and browser behavior were not run in this
pass. SlickGrid 2.2 is the original target, not a current “latest” version.

## License

MIT
