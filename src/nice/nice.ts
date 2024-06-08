import { app } from './lib/nice-app';

import { Component as ComponentInternal, ComponentPropertyDefinitions, component as componentInternal } from './lib/nice-component';
import { RenderFunctionReturn, RenderTemplate, render as renderInternal } from './lib/nice-renderer';
import { state as stateInternal, computed as computedInternal, ref as refInternal, State as StateInternal } from './lib/nice-state';
import { store as storeInternal } from './lib/nice-store';
import { mapper, styler, valueOf as valueOfInternal } from './lib/nice-utils';

type State<T> = Pick<StateInternal<T>, 'get' | 'set'>; 
type Prop<T> = T | State<T>; 
type Component<T> = Omit<ComponentInternal<T>, keyof ComponentInternal<T>>
type Node = Component<any> | State<any> | unknown;
type Ref<T> = Pick<State<T extends Event ? T : T>, 'get'>;

const state = stateInternal as <T = unknown>(value: T) => State<T>;
const computed = computedInternal as <U = unknown, T = undefined>(fn: (e: U) => T, deps?: (State<any> | unknown)[]) => State<T extends undefined ? U : T>;
const render = renderInternal as (template: RenderTemplate, ...args: Node[]) => (id: string) => { html: string; hydrate: () => HTMLDivElement; };
const component = componentInternal as <T extends ComponentPropertyDefinitions | undefined = undefined>(fn: (props: T, key?: string) => RenderFunctionReturn | void) => T extends undefined ? () => Component<T> : (props: T, key?: string) =>  T extends undefined ? () => Component<T> : (props: T, key?: string) => Component<T>;

const ref = refInternal as <T extends HTMLElement>(fn?: ((element: T) => void) | undefined) => Ref<T>;
const store = storeInternal as <T = object>(values: T) => (<U extends keyof T>(key: U) => State<T[U]>);
const valueOf = valueOfInternal as <T extends unknown>(property: T) => T extends Prop<infer U> ? U : never;

const hasWindow = typeof window !== 'undefined';
type ComponentType <T extends Component<any>> = T extends infer U extends (...args: any) => any ? Parameters<U>[0] : string;

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
    Node,
    Prop,
    State,
    ComponentType,
}