import { nextId, setParentId } from "./lib/utils";

let makeLastComponentDirty: () => void;

type NiceNode = NiceComponent<any> | NiceState<any>;

interface NiceComponent<T extends NiceComponentProperties> {
    type: 'component';
    id: string;
    render: (id: string) => HTMLElement | void;
    markDirty: () => void;
    properties: T;
}

type NiceComponentProperties = Record<string, NiceState<any>>;
type NiceComponentPropertyDefinitions = Record<string, any>;
type NiceComponentPropertyTransformation<T extends NiceComponentPropertyDefinitions> = { [K in keyof T]: NiceState<T[K]> };

interface NiceState<T> {
    type: 'state';
    id: string;
    get: () => T;
    set: (newValue: T | ((current: T) => T)) => void;
    listen: (listener: (newValue: T) => void) => void;
    textNodes: Text[];
    markers: Comment[][];
}

type NiceRenderTemplate = TemplateStringsArray;
type NiceRenderArgs = NiceNode[];

export const app = (selector: string, fn: () => ReturnType<typeof render> | void) => {
    const root = document.querySelector(selector);
    if (!root) throw new Error(`Failed to attach - Element "${selector}" not found in the DOM.`);

    const rootComponent = component(fn)({});

    rootComponent.markDirty = () => {
        const html = rootComponent.render('R');
        if (!html) return;

        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }

        Array.from(html.children).forEach((child) => {
            root.appendChild(child);
        });
    }

    rootComponent.markDirty();
};

export const component = <T extends NiceComponentPropertyDefinitions>(fn: (props: NiceComponentPropertyTransformation<T>) => ReturnType<typeof render> | void) => {
    const id = nextId();
    setParentId(id);

    let isUpdating = false;
    let componentProps: NiceComponentPropertyTransformation<T> = {} as NiceComponentPropertyTransformation<T>;

    let render = (id: string) => {};

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

    return (props: NiceComponentPropertyTransformation<T>) => {
        makeLastComponentDirty = markDirty;
        componentProps = props;
        render = fn(componentProps) as any;

        return ({
            id,
            type: 'component',
            properties: props,
            render,
            markDirty,
        }) as NiceComponent<T>
    };
};

export const state = <T = unknown>(value: T): NiceState<T> => {
    let _value = value;
    const id = nextId();
    const listeners: ((newValue: T) => void)[] = [];
    const markDirty = makeLastComponentDirty;
    const nodes: Text[] = [];
    const markers: Comment[][] = [];

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

                markers.forEach(([start, end]) => {
                    replaceNodesFrom(_value, start, end);
                });
            }
        },
        listen: (listener: (newValue: T) => void) => listeners.push(listener),
        textNodes: nodes,
        markers: markers
    }
}

export const computed = <T = unknown>(fn: () => T, deps: NiceState<any>[]): NiceState<T> => {
    const _value = state<T>(undefined as T);
    const lastDeps: string | undefined = undefined;

    const doCompute = () => {
        const newValue = fn();
        const newDeps = serialiseDeps(deps);
        if (newValue !== _value.get() && newDeps !== lastDeps) {
            _value.set(newValue);
        }
    }

    deps.forEach((dep) => dep.listen(doCompute));
    doCompute();

    return _value
};

export const serialiseDeps = (deps: NiceState<any>[]) => {
    return deps.map((dep) => JSON.stringify(dep.get())).join('');
}


export const render = (template: NiceRenderTemplate, ...args: NiceRenderArgs) => {
    const debugRender = false;
    
    const doRender = (id: string) => {
        const prefixComment = `<!-- ${id} BEGIN -->`;
        const suffixComment = `<!-- ${id} END -->`;

        let html = '';
        if(debugRender) html += prefixComment;

        const childrenToReattach: Record<string, HTMLElement | void> = {};
        const stateToReattach: Record<string, NiceState<any>> = {};

        template.forEach((block, index) => {
            const nextVar = args[index];
            html += block;
            if (nextVar === undefined) return;

            const randomId = Math.random().toString(36).substring(7);

            switch (nextVar.type) {
                case 'component':
                    html += randomId;
                    childrenToReattach[randomId] = nextVar.render(nextVar.id);
                    break;
                case 'state':
                    html += randomId;
                    stateToReattach[randomId] = nextVar;
                    break;
            }
        });

        if(debugRender) html += suffixComment;

        Object.keys(childrenToReattach).forEach((id) => {
            html = html.replace(id, `<span data-reattach-child="${id}"></span>`);
        });

        Object.keys(stateToReattach).forEach((id) => {
            html = html.replace(id, `<!-- START --><span data-reattach-state="${id}"></span><!-- END -->`);
        });

        const htmlAsDom = renderAsHTML(html);
        htmlAsDom.children[0].setAttribute('data-nice-id', id)

        Object.keys(stateToReattach).forEach((id) => {
            htmlAsDom.querySelectorAll(`[data-reattach-state="${id}"]`).forEach((el) => {
                let value = stateToReattach[id].get();

                stateToReattach[id].markers.push([
                    el.previousSibling as Comment,
                    el.nextSibling as Comment,
                ]);

                replaceNodesFrom(value, el.previousSibling as Comment, el.nextSibling as Comment);
            });
        });

        Object.keys(childrenToReattach).forEach((id) => {
            htmlAsDom.querySelectorAll(`[data-reattach-child="${id}"]`).forEach((el) => {
                el.replaceWith(childrenToReattach[id] as HTMLElement);
            });
        });

        return htmlAsDom;
    }

    return doRender;
}

const replaceNodesFrom = (value: unknown | NiceComponent<any>, start: Comment, end: Comment) => {
    const childrenBetweenMarkers: (Text | HTMLElement)[] = [];
    let next: ChildNode | null | undefined = start.nextSibling;

    while (next !== end) {
        childrenBetweenMarkers.push(next as Text);
        next = next?.nextSibling;
    }

    if (value && typeof value === 'object' && (value as any).type === 'component') {
        const newValueComponent = value as unknown as NiceComponent<any>;
        const valueValue = newValueComponent.render(newValueComponent.id);
        childrenBetweenMarkers.forEach((node) => node!.remove());
        if (valueValue) Array.from(valueValue.children).reverse().forEach((child) => start.after(child));
    } else {
        if (childrenBetweenMarkers.length === 1 && childrenBetweenMarkers[0].nodeType === Node.TEXT_NODE) {
            childrenBetweenMarkers[0]!.textContent = value as string;
        } else {
            childrenBetweenMarkers.forEach((node) => node!.remove());
            const text = document.createTextNode(value as string);
            start.after(text);
        }
    }
}

const renderAsHTML = (html: string) => {
    const dom = document.createElement('div');
    dom.innerHTML = html;

    return dom;
}