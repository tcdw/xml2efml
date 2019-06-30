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
        output += `${spaces.repeat(indent)}>${element.tagName}`;
        Array.prototype.forEach.call(element.classList, (e) => {
            output += `.${e}`;
        });
        output += '\n';
        Array.prototype.forEach.call(element.attributes, (e) => {
            if (e.name === 'class') {
                return;
            }
            output += `${spaces.repeat(indent + 1)}#${e.name}`;
            if (e.value !== '') {
                output += ` = ${e.value}`;
            }
            output += '\n';
        });
        Array.prototype.forEach.call(element.childNodes, (e) => {
            switch (e.nodeType) {
                case 1: {
                    recursive(e, indent + 1);
                    break;
                }
                case 3: {
                    if (!ignoreEmptyTextNode || e.textContent.trim() !== '') {
                        output += `${spaces.repeat(indent + 1)}.${e.textContent.replace(/&/g, '&&').replace(/\n/g, '&n')}\n`;
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

/**
 * @param {Element} elem
 */
function dom2ast(elem, {
    ignoreEmptyTextNode = true,
} = {}) {
    const myRoot = [];
    const myTag = {
        t: elem.tagName,
    };
    const myAttr = {};
    Array.prototype.forEach.call(elem.attributes, (e) => {
        myAttr[e.name] = e.value;
    });
    if (Object.keys(myAttr).length > 0) {
        myTag.a = myAttr;
    }
    myRoot.push(myTag);
    Array.prototype.forEach.call(elem.childNodes, (e) => {
        switch (e.nodeType) {
            case 1: {
                myRoot.push(dom2ast(e, {
                    ignoreEmptyTextNode,
                }));
                break;
            }
            case 3: {
                if (!ignoreEmptyTextNode || e.textContent.trim() !== '') {
                    myRoot.push(e.textContent);
                }
                break;
            }
            default: {
                console.warn(`The nodeType value is ${e.nodeType} (${nodeTypeMap[e.nodeType]}), which didn't handled by dom2efml`);
                break;
            }
        }
    });
    return myRoot;
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
        throw new ReferenceError('htmlSnippet2efml requires a window');
    }
    let result = '';
    const parser = new myWindow.DOMParser();
    const data = parser.parseFromString(str, 'text/html');
    function loop(e) {
        switch (e.nodeType) {
            case 1: {
                result += dom2efml(e, {
                    spaces,
                    ignoreEmptyTextNode,
                });
                break;
            }
            case 3: {
                if (!ignoreEmptyTextNode || e.textContent.trim() !== '') {
                    result += `.${e.textContent.replace(/&/g, '&&').replace(/\n/g, '&n')}\n`;
                }
                break;
            }
            default: {
                console.warn(`The nodeType value is ${e.nodeType} (${nodeTypeMap[e.nodeType]}), which didn't handled by dom2efml`);
                break;
            }
        }
    }
    Array.prototype.forEach.call(data.head.childNodes, loop);
    Array.prototype.forEach.call(data.body.childNodes, loop);
    return result;
}

function htmlSnippet2ast(str, {
    ignoreEmptyTextNode = true,
    win,
} = {}) {
    let myWindow;
    if (typeof win === 'object') {
        myWindow = win;
    } else if (typeof window !== 'undefined') {
        myWindow = window;
    } else {
        throw new ReferenceError('htmlSnippet2ast requires a window');
    }
    const parser = new myWindow.DOMParser();
    const data = parser.parseFromString(str, 'text/html');
    const childs = Array.from(data.head.childNodes);
    Array.prototype.forEach.call(data.body.childNodes, (e) => {
        childs.push(e);
    });
    if (childs.length === 1) {
        return dom2ast(childs[0], { ignoreEmptyTextNode });
    }
    // ========== if has more than 1 childs ==========
    const root = [{
        t: 0,
    }];
    childs.forEach((e) => {
        switch (e.nodeType) {
            case 1: {
                root.push(dom2ast(e, { ignoreEmptyTextNode }));
                break;
            }
            case 3: {
                if (!ignoreEmptyTextNode || e.textContent.trim() !== '') {
                    root.push(e.textContent);
                }
                break;
            }
            default: {
                console.warn(`The nodeType value is ${e.nodeType} (${nodeTypeMap[e.nodeType]}), which didn't handled by dom2efml`);
                break;
            }
        }
    });
    return root;
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
        throw new ReferenceError('xml2efml requires a window');
    }
    const parser = new myWindow.DOMParser();
    const data = parser.parseFromString(str, type);
    const result = dom2efml(data.documentElement, {
        spaces,
        ignoreEmptyTextNode,
    });
    return result;
}

function xml2ast(str, {
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
        throw new ReferenceError('xml2ast requires a window');
    }
    const parser = new myWindow.DOMParser();
    const data = parser.parseFromString(str, type);
    const result = dom2ast(data.documentElement, {
        ignoreEmptyTextNode,
    });
    return result;
}

module.exports = {
    dom2efml,
    dom2ast,
    htmlSnippet2efml,
    htmlSnippet2ast,
    xml2efml,
    xml2ast,
};
