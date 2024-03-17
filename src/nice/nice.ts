import { nextId, setParentId } from "./lib/utils";

type NiceNode = NiceComponent<any> | NiceState<any>;

interface NiceComponent<T> {
    type: 'component';
    id: string;
    render: (id: string) => HTMLElement | void;
    markDirty: () => void;
    properties: T;
}

type NiceComponentPropertyDefinitions = Record<string, any>;

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

export type NiceRenderTemplate = TemplateStringsArray;
export type NiceRenderArgs = NiceNode[];

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

export const component = <T extends NiceComponentPropertyDefinitions>(fn: (props: T) => ReturnType<typeof render> | void) => {
    let id = ''

    let isUpdating = false;
    let componentProps: T = {} as T;

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

    return (props: T) => {
        id = nextId();
        setParentId(id);
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
                        el.setAttribute(key, newValueSettled as string);
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

export const computed = <U = Event | unknown, T = unknown>(fn: (e: U extends Event ? U : never) => T, deps?: NiceState<any>[]): NiceState<T> => {
    const _value = state<T>(undefined as T);
    const lastDeps: string | undefined = undefined;

    const doCompute = (e?: any) => {
        const isEvent = !!e && !deps;
        const newValue = fn(e);
        const newDeps = serialiseDeps(deps ?? []);
        if (newValue !== _value.get() && newDeps !== lastDeps && !isEvent) {
            _value.set(newValue);
        }
    }

    if (deps) {
        deps.forEach((dep) => dep.listen(doCompute));
        doCompute();
    } else {
        _value.listen(doCompute);
    }

    return _value
};

const serialiseDeps = (deps: NiceState<any>[]) => {
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
            const beforeId = html.split(id)[0];
            const isAttributeBind = matchAttributeBinding(beforeId);
            const replacer = isAttributeBind ? `state-${id}` : `<!-- @ --><span data-reattach-state="${id}"></span><!-- # -->`;
            html = html.replace(id, replacer);
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
                el.replaceWith((childrenToReattach[id] as HTMLElement).children[0]);
            });
        });

        htmlAsDom.querySelectorAll('*').forEach((el) => {
            Array.from(el.attributes).forEach((attr) => {
                const isAction = attr.name.startsWith('on-');
                const isSetter = attr.name.startsWith('set-');
                const stateId = attr.value.match(/state-(.+)/);
                if (stateId) {
                    const state = stateToReattach[stateId[1]];
                    if (!state) return;
                    if (!state.attributes[attr.name]) state.attributes[attr.name] = [];

                    if (isAction) {
                        el.removeAttribute(attr.name);
                        el.addEventListener(attr.name.slice(3), (e) => state.set(e as any));
                    } else if (isSetter) {
                        el.removeAttribute(attr.name);
                        state.listen((newValue) => {
                            (el as any)[attr.name.slice(4)] = newValue;
                        });
                    } else {
                        state.attributes[attr.name].push(el as HTMLElement);
                        el.setAttribute(attr.name, (state.get() ?? '') as string);
                    }

                }
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
        const valueAsArray = Array.isArray(value) ? value : [value];
        const valuesToRender = valueAsArray.map((v) => {
            if (typeof v === 'object' && (v as any).type === 'component') {
                const newValueComponent = v as unknown as NiceComponent<any>;
                return newValueComponent.render(newValueComponent.id);
            } else {
                return v;
            }
        });

        childrenBetweenMarkers.forEach((node) => node!.remove());
        valuesToRender.reverse().forEach((valueValue) => {
            if (valueValue instanceof HTMLElement) Array.from(valueValue.children).reverse().forEach((child) => start.after(child));
            else {
                const text = document.createTextNode(valueValue as string);
                start.after(text);
            }
        });
    }
}

export const mapper = <T = number>(data: T, fn: ((value: T, index: number) => any)) => {
    let array: any[] = [];
    if (typeof data === 'number') {
        array = Array.from({ length: data }, (_, i) => i + 1);
    } else if (typeof data === 'object') {
        array = Array.from(Object.entries(data as any));
    } else if (Array.isArray(data)) {
        array = data;
    }

    return array.map((value, index) => fn(value, index));
}

const renderAsHTML = (html: string) => {
    const dom = document.createElement('div');
    dom.innerHTML = html;

    return dom;
}

const matchAttributeBinding = (str: string) => {
    const regex = /.+\b(.+)="$/gm;
    let m;
    const matches: string[] = [];

    while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        m.forEach((match) => {
            matches.push(match);
        });
    }

    if (matches.length === 2) return matches[1];
    else return undefined
}