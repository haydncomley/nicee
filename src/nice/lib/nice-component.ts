import { RenderFunctionReturn } from "./nice-renderer";
import { State } from "./nice-state";
import { nextId, setParentId } from "./utils";

export type Node = Component<any> | State<any>;

export interface Component<T> {
    type: 'component';
    id: string;
    key?: string;
    render: (id: string) => { html: string; hydrate: () => HTMLDivElement; }
    markDirty: () => void;
    properties: T;
}

export type ComponentPropertyDefinitions = Record<string, any>;

export const component = <T extends ComponentPropertyDefinitions | undefined = undefined>(fn: (props: T, key?: string) => RenderFunctionReturn | void) => {
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

    const func = (props: T, key?: string): Component<T> => {
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
        }) as Component<T>
    }

    return func as T extends undefined ? () => Component<T> : (props: T, key?: string) => Component<T>;
};