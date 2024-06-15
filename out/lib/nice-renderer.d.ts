import type { Component, Node } from "./nice-component";
export type RenderTemplate = TemplateStringsArray;
export type RenderArgs = Node[];
export type RenderFunctionReturn = ReturnType<typeof render>;
export declare const render: (template: RenderTemplate, ...args: RenderArgs) => (id: string) => {
    html: string;
    hydrate: () => HTMLDivElement;
};
export declare const replaceNodesFrom: (value: unknown | Component<any>, start: Comment, end: Comment) => void;
