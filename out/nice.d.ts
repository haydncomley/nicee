import { app } from './lib/nice-app';
import { NiceComponent as NiceComponentInternal, NiceComponentPropertyDefinitions } from './lib/nice-component';
import { NiceRenderFunctionReturn, NiceRenderTemplate } from './lib/nice-renderer';
import { NiceState as NiceStateInternal } from './lib/nice-state';
import { mapper, styler } from './lib/nice-utils';
type NiceState<T> = Pick<NiceStateInternal<T>, 'get' | 'set'>;
type NiceProp<T> = T | NiceState<T>;
type NiceComponent<T> = Omit<NiceComponentInternal<T>, keyof NiceComponentInternal<T>>;
type NiceNode = NiceComponent<any> | NiceState<any> | unknown;
type NiceRef<T> = Pick<NiceState<T extends Event ? T : T>, 'get'>;
declare const state: <T = unknown>(value: T) => NiceState<T>;
declare const computed: <U = unknown, T = unknown>(fn: (e: U extends Event ? U : unknown) => T, deps?: (NiceState<any> | unknown)[]) => NiceState<U extends Event ? U : T>;
declare const render: (template: NiceRenderTemplate, ...args: NiceNode[]) => (id: string) => {
    html: string;
    hydrate: () => HTMLDivElement;
};
declare const component: <T extends NiceComponentPropertyDefinitions | undefined = undefined>(fn: (props: T, key?: string) => NiceRenderFunctionReturn | void) => T extends undefined ? () => NiceComponent<T> : (props: T, key?: string) => T extends undefined ? () => NiceComponent<T> : (props: T, key?: string) => NiceComponent<T>;
declare const ref: <T extends HTMLElement>(fn?: ((element: T) => void) | undefined) => NiceRef<T>;
declare const store: <T = object>(values: T) => <U extends keyof T>(key: U) => NiceState<T[U]>;
declare const valueOf: <T extends unknown>(property: T) => T extends NiceProp<infer U> ? U : never;
declare const hasWindow: boolean;
type ComponentType<T extends NiceComponent<any>> = T extends infer U extends (...args: any) => any ? Parameters<U>[0] : string;
export { ref, app, store, state, styler, mapper, render, valueOf, computed, component, hasWindow, };
export type { NiceNode, NiceProp, NiceState, ComponentType, };
