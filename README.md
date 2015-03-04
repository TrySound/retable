# retable
Transform table for mobile

## Usage

```html
<table class="retable" data-retable-type="row">
  <tr>
    <th>Title 1</th>
    <th>Title 1</th>
  </tr>
  <tr>
    <td>Content 1</td>
    <td>Content 1</td>
  </tr>
</table>
```

or

```js
retable(selector, options);
```

## Options

- `options.type` - `row`, `column`, `separator`
- `options.caption` - mod

##Adaptive Helpers

- `.retable-sm` - desktop at 768px
- `.retable-md` - desktop at 992px
- `.retable-lg` - desktop at 1200px


## License

[The MIT License (MIT)](LICENSE)

Copyright &copy; 2015 Bogdan Chadkin
