import { RenderFunctionReturn } from "./nice-renderer";
import { State } from "./nice-state";
export type Node = Component<any> | State<any>;
export interface Component<T> {
    type: 'component';
    id: string;
    key?: string;
    render: (id: string) => {
        html: string;
        hydrate: () => HTMLDivElement;
    };
    markDirty: () => void;
    properties: T;
}
export type ComponentPropertyDefinitions = Record<string, any>;
export declare const component: <T extends ComponentPropertyDefinitions | undefined = undefined>(fn: (props: T, key?: string) => RenderFunctionReturn | void) => T extends undefined ? () => Component<T> : (props: T, key?: string) => Component<T>;
