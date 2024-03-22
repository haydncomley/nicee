import { NiceRenderFunctionReturn } from "./nice-renderer";
import { NiceState } from "./nice-state";
export type NiceNode = NiceComponent<any> | NiceState<any>;
export interface NiceComponent<T> {
    type: 'component';
    id: string;
    render: (id: string) => {
        html: string;
        hydrate: () => HTMLDivElement;
    };
    markDirty: () => void;
    properties: T;
}
export type NiceComponentPropertyDefinitions = Record<string, any>;
export declare const component: <T extends NiceComponentPropertyDefinitions | undefined = undefined>(fn: (props: T) => NiceRenderFunctionReturn | void) => T extends undefined ? () => NiceComponent<T> : (props: T) => NiceComponent<T>;
