import { NiceComponent, NiceNode } from "./nice-component";
export type NiceRenderTemplate = TemplateStringsArray;
export type NiceRenderArgs = NiceNode[];
export type NiceRenderFunctionReturn = ReturnType<typeof render>;
export declare const render: (template: NiceRenderTemplate, ...args: NiceRenderArgs) => (id: string) => HTMLDivElement;
export declare const replaceNodesFrom: (value: unknown | NiceComponent<any>, start: Comment, end: Comment) => void;
