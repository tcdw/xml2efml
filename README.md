# xml2efml

A library let you convert existing XML/HTML/etc. to [EFML](https://ef.js.org/#!guides/efml), which could be used by [ef.js](https://ef.js.org).

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
// You can also save this snippet as bookmark! (with `javascript:` prefix)
var s = document.createElement('script');
s.src = "https://bundle.run/xml2efml";
document.body.appendChild(s);
```

After the script loaded...

```javascript
// This function returns the converted EFML of any DOMs user specified
xml2efml.dom2efml(document.querySelector('.nav-menu'), {
    spaces: '    ',
    ignoreEmptyTextNode: true,
    // How many extra indents we should add at beginning of every line?
    indentOffset: 0,
});
```

## License

MIT
