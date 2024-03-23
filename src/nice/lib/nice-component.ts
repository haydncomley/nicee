import { NiceRenderFunctionReturn } from "./nice-renderer";
import { NiceState } from "./nice-state";
import { nextId, setParentId } from "./utils";

export type NiceNode = NiceComponent<any> | NiceState<any>;

export interface NiceComponent<T> {
    type: 'component';
    id: string;
    key?: string;
    render: (id: string) => { html: string; hydrate: () => HTMLDivElement; }
    markDirty: () => void;
    properties: T;
}

export type NiceComponentPropertyDefinitions = Record<string, any>;

export const component = <T extends NiceComponentPropertyDefinitions | undefined = undefined>(fn: (props: T, key?: string) => NiceRenderFunctionReturn | void) => {
    let id = ''

    let isUpdating = false;
    let componentProps: T = {} as T;

    let render = (_id: string) => {};

    const markDirty = () => {
        const element = document.querySelector(`[data-nice-id="${id}"]`);
        if (!element || isUpdating) return;
        isUpdating = true;
        setTimeout(() => {
            const newDom = render(id) as HTMLElement | void;
            if(newDom) element.replaceWith(newDom.children[0]);
            isUpdating = false;
        }, 0);
    }

    const func = (props: T, key?: string): NiceComponent<T> => {
        id = nextId();
        setParentId(id);
        componentProps = (props ?? {}) as T;
        render = fn(componentProps, key) as any;

        return ({
            id,
            type: 'component',
            properties: props,
            render,
            markDirty,
            key: key ?? id
        }) as NiceComponent<T>
    }

    return func as T extends undefined ? () => NiceComponent<T> : (props: T, key?: string) => NiceComponent<T>;
};