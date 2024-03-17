import { render } from "./nice-renderer";
import { nextId, setParentId } from "./utils";

export interface NiceComponent<T> {
    type: 'component';
    id: string;
    render: (id: string) => HTMLElement | void;
    markDirty: () => void;
    properties: T;
}

export type NiceComponentPropertyDefinitions = Record<string, any>;

export const component = <T extends NiceComponentPropertyDefinitions | undefined = undefined>(fn: (props: T) => ReturnType<typeof render> | void) => {
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

    const func = (props: T): NiceComponent<T> => {
        id = nextId();
        setParentId(id);
        componentProps = (props ?? {}) as T;
        render = fn(componentProps) as any;

        return ({
            id,
            type: 'component',
            properties: props,
            render,
            markDirty,
        }) as NiceComponent<T>
    }

    return func as T extends undefined ? () => NiceComponent<T> : (props: T) => NiceComponent<T>;
};