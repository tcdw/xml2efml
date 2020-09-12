export function dom2efml(elem: Element, { spaces, ignoreEmptyTextNode, indentOffset, }?: {
    spaces?: string;
    ignoreEmptyTextNode?: boolean;
    indentOffset?: number;
}): string;

export function dom2ast(elem: Element, { ignoreEmptyTextNode, }?: {
    ignoreEmptyTextNode?: boolean;
}): {
    t: string;
}[];

export function htmlSnippet2efml(str: string, { spaces, ignoreEmptyTextNode, win, }?: {
    spaces?: string;
    ignoreEmptyTextNode?: boolean;
    win: Window;
}): string;

export function htmlSnippet2ast(str: string, { ignoreEmptyTextNode, win, }?: {
    ignoreEmptyTextNode?: boolean;
    win: Window;
}): {
    t: string;
}[] | {
    t: number;
}[];

export function xml2efml(str: string, { spaces, ignoreEmptyTextNode, win, type, }?: {
    spaces?: string;
    ignoreEmptyTextNode?: boolean;
    win: Window;
    type?: string;
}): string;

export function xml2ast(str: string, { ignoreEmptyTextNode, win, type, }?: {
    ignoreEmptyTextNode?: boolean;
    win: Window;
    type?: string;
}): {
    t: string;
}[];
