export interface NiceState<T> {
    type: 'state';
    id: string;
    get: () => T;
    set: (newValue: T | ((current: T) => T)) => void;
    listen: (listener: (newValue: T) => void) => void;
    textNodes: Text[];
    markers: Comment[][];
    attributes: Record<string, HTMLElement[]>;
}
export type NiceProp<T> = T | NiceState<T>;
export declare const state: <T = unknown>(value: T) => NiceState<T>;
export declare const computed: <U = unknown, T = unknown>(fn: (e: U extends Event ? U : unknown) => T, deps?: (NiceState<any> | unknown)[]) => NiceState<U extends Event ? U : T>;
export declare const ref: <T extends HTMLElement>(fn?: ((element: T) => void) | undefined) => NiceState<T extends Event ? T : T>;
