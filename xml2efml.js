const nodeTypeMap = {
    1: 'ELEMENT_NODE',
    2: 'ATTRIBUTE_NODE',
    3: 'TEXT_NODE',
    4: 'CDATA_SECTION_NODE',
    5: 'ENTITY_REFERENCE_NODE',
    6: 'ENTITY_NODE',
    7: 'PROCESSING_INSTRUCTION_NODE',
    8: 'COMMENT_NODE',
    9: 'DOCUMENT_NODE',
    10: 'DOCUMENT_TYPE_NODE',
    11: 'DOCUMENT_FRAGMENT_NODE',
    12: 'NOTATION_NODE',
};

function dom2efml(elem, {
    spaces = '    ',
    ignoreEmptyTextNode = true,
    indentOffset = 0,
} = {}) {
    let output = '';
    /**
     * @param {Element} element
     * @param {number} indent
     */
    function recursive(element, indent) {
        if (indent === undefined) {
            indent = 0;
        }
        output += `${spaces.repeat(indent)}>${element.tagName}\n`;
        Array.prototype.forEach.call(element.attributes, (e) => {
            output += `${spaces.repeat(indent + 1)}#${e.name} = ${e.value}\n`;
        });
        Array.prototype.forEach.call(element.childNodes, (e) => {
            switch (e.nodeType) {
                case 1: {
                    recursive(e, indent + 1);
                    break;
                }
                case 3: {
                    if (!ignoreEmptyTextNode || e.textContent.trim() !== '') {
                        output += `${spaces.repeat(indent + 1)}.${e.textContent.replace(/\n/g, '&n').replace(/&/g, '&&')}\n`;
                    }
                    break;
                }
                default: {
                    console.warn(`The nodeType value is ${e.nodeType} (${nodeTypeMap[e.nodeType]}), which didn't handled by dom2efml`);
                    break;
                }
            }
        });
    }
    recursive(elem, indentOffset);
    return output;
}

function htmlSnippet2efml(str, {
    spaces = '    ',
    ignoreEmptyTextNode = true,
    win,
} = {}) {
    let myWindow;
    if (typeof win === 'object') {
        myWindow = win;
    } else if (typeof window !== 'undefined') {
        myWindow = window;
    } else {
        throw new ReferenceError('html2efml requires a window');
    }
    let result = '';
    const parser = new myWindow.DOMParser();
    const data = parser.parseFromString(str, 'text/html');
    function loop(e) {
        if (e instanceof myWindow.Element) {
            result += dom2efml(e, {
                spaces,
                ignoreEmptyTextNode,
            });
        } else {
            console.warn(`There is a non-element node (${e.nodeType}, ${nodeTypeMap[e.nodeType]}) couldn't be handled by this converter`);
        }
    }
    Array.prototype.forEach.call(data.head.childNodes, loop);
    Array.prototype.forEach.call(data.body.childNodes, loop);
    return result;
}

function xml2efml(str, {
    spaces = '    ',
    ignoreEmptyTextNode = true,
    win,
    type = 'text/xml',
} = {}) {
    let myWindow;
    if (typeof win === 'object') {
        myWindow = win;
    } else if (typeof window !== 'undefined') {
        myWindow = window;
    } else {
        throw new ReferenceError('html2efml requires a window');
    }
    const parser = new myWindow.DOMParser();
    const data = parser.parseFromString(str, type);
    const result = dom2efml(data.documentElement, {
        spaces,
        ignoreEmptyTextNode,
    });
    return result;
}

module.exports = {
    dom2efml,
    htmlSnippet2efml,
    xml2efml,
};
