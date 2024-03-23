import { replaceNodesFrom } from "./nice-renderer";
import { nextId, serialiseDeps } from "./utils";

export interface NiceState<T> {
    type: 'state';
    id: string;
    get: () => T;
    set: (newValue: T) => void;
    listen: (listener: (newValue: T) => void) => void;
    textNodes: Text[];
    markers: Comment[][];
    attributes: Record<string, HTMLElement[]>;
}

export type NiceProp<T> = T | NiceState<T>;

export const state = <T = unknown>(value: T): NiceState<T> => {
    let _value = value;
    const id = nextId();
    const listeners: ((newValue: T) => void)[] = [];
    const nodes: Text[] = [];
    const markers: Comment[][] = [];
    const attributes: Record<string, HTMLElement[]> = {};

    return {
        id,
        type: 'state',
        get: () => _value,
        set: (newValue: T | ((current: T) => T)) => {
            let newValueSettled = _value;

            if (typeof value === 'function') {
                newValueSettled = (newValue as ((current: T) => T))(_value);
            } else {
                newValueSettled = newValue as T;
            }

            if (newValueSettled !== _value) {
                _value = newValueSettled;
                listeners.forEach((listener) => listener(newValueSettled));

                Object.entries(attributes).forEach(([key, elements]) => {
                    elements.forEach((el) => {
                        el.setAttribute(key, (newValueSettled ?? '') as string);
                    });
                });

                markers.forEach(([start, end]) => {
                    replaceNodesFrom(_value, start, end);
                });
            }
        },
        listen: (listener: (newValue: T) => void) => listeners.push(listener),
        textNodes: nodes,
        markers: markers,
        attributes,
    }
}

export const computed = <U = Event | unknown, T = unknown>(fn: (e: U extends Event ? U : unknown) => T, deps?: (NiceState<any> | unknown)[]): NiceState<U extends Event ? U : T> => {
    const _value = state<T>(undefined as T);
    const lastDeps: string | undefined = undefined;
    const niceDeps = (deps ?? []).map((x) => {
        if (x && typeof x === 'object' && Object.hasOwn(x, 'listen')) {
            return x;
        }
        return false;
    }).filter(Boolean) as NiceState<any>[];

    const doCompute = (e?: any) => {
        const isEvent = !!e && !deps;
        const newValue = fn(e);
        const newDeps = serialiseDeps(niceDeps);
        if (newValue !== _value.get() && newDeps !== lastDeps && !isEvent) {
            _value.set(newValue);
        }
    }

    if (deps) {
        niceDeps.forEach((dep) => dep.listen(doCompute));
        doCompute();
    } else {
        _value.listen(doCompute);
    }

    return _value as NiceState<U extends Event ? U : T>;
};

export const ref = <T extends HTMLElement>(fn?: (element: T) => void) => {
    return computed<T, T>((fn ? fn : () => {}) as any);
}