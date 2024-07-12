# README

Typescript port of [htmldiff-js](https://github.com/dfoverdx/htmldiff-js), which is the JavaScript port of [HtmlDiff.NET](https://github.com/Rohland/htmldiff.net) which is itself a C# port of the Ruby implementation, [HtmlDiff](https://github.com/myobie/htmldiff/).

## Project Description

Diffs two HTML blocks, and returns a meshing of the two that includes `<ins>` and `<del>` elements. The classes of these elements are `ins.diffins` for new code, `del.diffdel` for removed code, and `del.diffmod` and `ins.diffmod` for sections of code that have been changed.

For "special tags" (primarily style tags such as `<em>` and `<strong>`), `ins.mod` elements are inserted with the new styles.

Further description can be found at this [blog post](https://web.archive.org/web/20180106000348/http://www.rohland.co.za:80/index.php/2009/10/31/csharp-html-diff-algorithm/) written by Rohland, the author of HtmlDiff.NET.

**Note**: The diffing algorithm isn't perfect. One example is that if a new `<p>` ends in the same string as the previous `<p>` tag did, two `<ins>` tags will be created: one starting at the beginning of the common string in the first `<p>` and one in the second `<p>` containing all the content up to the point the trailing common string begins. It's a little frustrating, but I didn't write the algorithm (and honestly don't really understand it); I only ported it.

## Usage

### Html

```html
<html>
  <body>
    <div id="oldHtml">
      <p>Some <em>old</em> html here</p>
    </div>

    <div id="newHtml">
      <p>Some <b>new</b> html goes here</p>
    </div>

    <div id="diffHtml"></div>
  </body>
</html>
```

#### JavaScript

```javascript
import HtmlDiff from 'htmldiff-js';

const oldHtml = document.getElementById('oldHtml');
const newHtml = document.getElementById('newHtml');
const diffHtml = document.getElementById('diffHtml');

diffHtml.innerHTML = HtmlDiff.execute(oldHtml.innerHTML, newHtml.innerHTML);
```
