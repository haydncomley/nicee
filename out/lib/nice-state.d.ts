export interface State<T> {
    type: 'state';
    id: string;
    get: () => T;
    set: (newValue: T) => void;
    listen: (listener: (newValue: T) => void) => void;
    textNodes: Text[];
    markers: Comment[][];
    attributes: Record<string, HTMLElement[]>;
}
export type Prop<T> = T | State<T>;
export declare const state: <T = unknown>(value: T) => State<T>;
export declare const computed: <U = unknown, T = undefined>(fn: (e: U) => T, deps?: (State<any> | unknown)[]) => State<T extends undefined ? U : T>;
export declare const ref: <T extends HTMLElement>(fn?: ((element: T) => void) | undefined) => State<T extends undefined ? T : T>;
