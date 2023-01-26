# xml2efml

[![version](https://img.shields.io/npm/v/xml2efml.svg)](https://www.npmjs.com/package/xml2efml) ![license](https://img.shields.io/npm/l/xml2efml.svg)

A library let you convert existing XML/HTML/etc. to [EFML](https://ef.js.org/#!guides/efml), which could be used by [ef.js](https://ef.js.org).

Since 2.x, this library is avaliable as native ES Module!

## Install

```bash
# xml2efml requires a vaild `window` with `DOMParser` to work.
# For browser-side, you DO NOT need to care about that; However, for Node.js, you need to.
# We recommend using libraries such as `jsdom`.
npm install xml2efml jsdom
```

## General XML/HTML Parsing

```javascript
const xml2efml = require('xml2efml');
const { JSDOM } = require('jsdom');

// This is our window
const { window } = new JSDOM('');

const dom1 = xml2efml.xml2efml(`
<derp>
    <subDerp id="1">Alice</subDerp>
    <subDerp id="2">Bob</subDerp>
    <subDerp id="3" />
</derp>
`, {
    // Spaces used for indent. Example:
    // 2 spaces: '  '
    // 4 spaces: '    '
    // tab:      '\t'
    // Default:  '    '
    spaces: '    ',
    // Will ignore any empty (or only has blank characters) text node. Default: true
    ignoreEmptyTextNode: true,
    // The `window` xml2efml uses. Default: `window` in global scope
    win: window,
    // File type; Accepting any kinds of input `DOMParser` allowed.
    // For a list of supported types, see https://w3c.github.io/DOM-Parsing/#the-domparser-interface
    type: 'text/xml',
});
```

And `dom1` will become:

```
>derp
    >subDerp
        #id = 1
        .Alice
    >subDerp
        #id = 2
        .Bob
    >subDerp
        #id = 3
```

## HTML Snippet Parsing

```javascript
const xml2efml = require('xml2efml');
const { JSDOM } = require('jsdom');
const { window } = new JSDOM('');

const dom2 = xml2efml.htmlSnippet2efml(`
<p>I am a <b>text</b>!</p>This also works now!
<div class="my-class such good mame" data-potato="tasty">
Such<hr>Content
</div>
`, {
    // This function is very similar to `XML2EFML.xml2efml()` without `type` argument;
    // However, this is designed for parsing HTML SNIPPETS only; That means if you input a full HTML,
    // `<html>`, `<head>` and `<body>` would be completely ignored.
    // For full HTML, please use `XML2EFML.xml2efml()` with `type` set to `text/html` instead.
    spaces: '    ',
    ignoreEmptyTextNode: true,
    win: window,
});
```

And `dom2` will become:

```
>P
    .I am a 
    >B
        .text
    .!
.This also works now!&n
>DIV.my-class.such.good.mame
    #data-potato = tasty
    .&nSuch
    >HR
    .Content&n
```

## Parsing Existing DOMs

You can also using `xml2efml.dom2efml()` standalone, including the Developer Tools console.

### Load the Library

```javascript
(async () => {
    // Load as native ES Module
    const { dom2efml } = await import("https://cdn.jsdelivr.net/npm/xml2efml@2/xml2efml.js");

    // Returns the converted EFML of any DOMs user specified
    console.log(dom2efml(document.querySelector('.nav-menu'), {
        spaces: '    ',
        ignoreEmptyTextNode: true,
        // How many extra indents we should add at beginning of every line?
        indentOffset: 0,
    }));
})();
```

## AST Output

You can also get the ef.js AST with these functions:

| EFML | AST |
| - | - |
| `dom2efml` | `dom2ast` |
| `htmlSnippet2efml` | `htmlSnippet2ast` |
| `xml2efml` | `xml2ast` |

All of AST outputing function's usage are exactly same as EFML's, except `spaces` and `indentOffset`, which is pointless for AST output.

The AST returned from these functions are in the same format as what [eft-parser](https://www.npmjs.com/package/eft-parser) outputs.

## License

MIT
