export interface EFMLConverterArgs {
    ignoreEmptyTextNode?: boolean;
}

export interface DOMToEFMLArgs extends EFMLConverterArgs {
    spaces?: string;
    indentOffset?: number;
}

export interface DOMToASTArgs extends EFMLConverterArgs {}

export interface HTMLSnippetToEFMLArgs extends EFMLConverterArgs {
    spaces?: string;
    win: Window;
}

export interface HTMLSnippetToASTArgs extends EFMLConverterArgs {
    win: Window;
}

export interface XMLToEFMLArgs extends EFMLConverterArgs {
    spaces?: string;
    win: Window;
    type?: string;
}

export interface XMLToASTArgs extends EFMLConverterArgs {
    win: Window;
    type?: string;
}


export function dom2efml(elem: Element, options?: DOMToEFMLArgs): string;

export function dom2ast(elem: Element, options?: DOMToASTArgs): any;

export function htmlSnippet2efml(str: string, options?: HTMLSnippetToEFMLArgs): string;

export function htmlSnippet2ast(str: string, options?: HTMLSnippetToASTArgs): any;

export function xml2efml(str: string, options?: XMLToEFMLArgs): string;

export function xml2ast(str: string, options?: XMLToASTArgs): any;