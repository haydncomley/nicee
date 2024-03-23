import { app } from './lib/nice-app';

import { NiceComponent as NiceComponentInternal, NiceComponentPropertyDefinitions, component as componentInternal } from './lib/nice-component';
import { NiceRenderFunctionReturn, NiceRenderTemplate, render as renderInternal } from './lib/nice-renderer';
import { state as stateInternal, computed as computedInternal, ref as refInternal, NiceState as NiceStateInternal } from './lib/nice-state';
import { store as storeInternal } from './lib/nice-store';
import { mapper, styler, valueOf as valueOfInternal } from './lib/nice-utils';

type NiceState<T> = Pick<NiceStateInternal<T>, 'get' | 'set'>; 
type NiceProp<T> = T | NiceState<T>; 
type NiceComponent<T> = Omit<NiceComponentInternal<T>, keyof NiceComponentInternal<T>>
type NiceNode = NiceComponent<any> | NiceState<any> | unknown;
type NiceRef<T> = Pick<NiceState<T extends Event ? T : T>, 'get'>;

const state = stateInternal as <T = unknown>(value: T) => NiceState<T>;
const computed = computedInternal as <U = unknown, T = unknown>(fn: (e: U extends Event ? U : unknown) => T, deps?: (NiceState<any> | unknown)[]) => NiceState<U extends Event ? U : T>;
const render = renderInternal as (template: NiceRenderTemplate, ...args: NiceNode[]) => (id: string) => { html: string; hydrate: () => HTMLDivElement; };
const component = componentInternal as <T extends NiceComponentPropertyDefinitions | undefined = undefined>(fn: (props: T, key?: string) => NiceRenderFunctionReturn | void) => T extends undefined ? () => NiceComponent<T> : (props: T, key?: string) =>  T extends undefined ? () => NiceComponent<T> : (props: T, key?: string) => NiceComponent<T>;

const ref = refInternal as <T extends HTMLElement>(fn?: ((element: T) => void) | undefined) => NiceRef<T>;
const store = storeInternal as <T = object>(values: T) => (<U extends keyof T>(key: U) => NiceState<T[U]>);
const valueOf = valueOfInternal as <T extends unknown>(property: T) => T extends NiceProp<infer U> ? U : never;

const hasWindow = typeof window !== 'undefined';
type ComponentType <T extends NiceComponent<any>> = T extends infer U extends (...args: any) => any ? Parameters<U>[0] : string;

export {
    ref,
    app,
    store,
    state,
    styler,
    mapper,
    render,
    valueOf,
    computed,
    component,
    hasWindow,
}

export type {
    NiceNode,
    NiceProp,
    NiceState,
    ComponentType,
}