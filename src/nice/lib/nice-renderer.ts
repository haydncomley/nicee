import { NiceComponent, NiceNode } from "./nice-component";
import { NiceState } from "./nice-state";

export type NiceRenderTemplate = TemplateStringsArray;
export type NiceRenderArgs = NiceNode[];
export type NiceRenderFunctionReturn = ReturnType<typeof render>;

export const render = (template: NiceRenderTemplate, ...args: NiceRenderArgs) => {
    const debugRender = false;
    
    const doRender = (id: string) => {
        const prefixComment = `<!-- ${id} BEGIN -->`;
        const suffixComment = `<!-- ${id} END -->`;

        let html = '';
        if(debugRender) html += prefixComment;

        const childrenToReattach: Record<string, { html: string; hydrate: () => HTMLDivElement; }> = {};
        const stateToReattach: Record<string, NiceState<any>> = {};

        template.forEach((block, index) => {
            const nextVar = args[index];
            html += block;
            if (nextVar === undefined) return;
            
            const randomId = Math.random().toString(36).substring(7);

            if (typeof nextVar !== 'object') {
                html += nextVar;
                return;
            }
            
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
            html = html.replace(id, childrenToReattach[id].html.replace(/(<.+)( )/, `$1 data-reattach-child="${id}" `));
        });

        Object.keys(stateToReattach).forEach((id) => {
            const beforeId = html.split(id)[0];
            const isAttributeBind = matchAttributeBinding(beforeId);

            const stateToRender = stateToReattach[id].get();
            let value = stateToRender;
            let extraItems = 1;

            if (stateToRender) {
                if (typeof stateToRender === 'object' && (stateToRender as any).type === 'component') {
                    const newValueComponent = stateToRender as unknown as NiceComponent<any>;
                    value = newValueComponent.render(newValueComponent.id).html;
                } else if (Array.isArray(stateToRender)) {
                    extraItems = stateToRender.length;
                    value = stateToRender.map((v) => {
                        if (typeof v === 'object' && (v as any).type === 'component') {
                            const newValueComponent = v as unknown as NiceComponent<any>;
                            return newValueComponent.render(newValueComponent.id).html;
                        } else {
                            return v;
                        }
                    }).join('');
                }
            }

            const replacer = isAttributeBind ? `state-${id};${value}` : `<!-- @ --><span data-reattach-state="${id}" data-reattach-extras="${!!value && extraItems}"></span>${value}<!-- # -->`;
            html = html.replace(id, replacer);
        });

        const hydrate = () => {
            const htmlAsDom = renderAsHTML(html);
            htmlAsDom.children[0].setAttribute('data-nice-id', id)
    
            Object.keys(stateToReattach).forEach((id) => {
                htmlAsDom.querySelectorAll(`[data-reattach-state="${id}"]`).forEach((el) => {
                    const removeExtras = el.getAttribute('data-reattach-extras');
                    console.log(removeExtras)
                    if (removeExtras && removeExtras !== 'false') {
                        for (let i = 0; i < parseInt(removeExtras); i++) el.nextSibling?.remove();
                    }
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
                    el.replaceWith((childrenToReattach[id].hydrate()).children[0]);
                });
            });
    
            htmlAsDom.querySelectorAll('*').forEach((el) => {
                Array.from(el.attributes).forEach((attr) => {
                    const isAction = attr.name.startsWith('on-');
                    const isSetter = attr.name.startsWith('set-');
                    const isRef = attr.name === 'ref';
                    const stateId = attr.value.match(/state-(.+?);/);
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
                            (el as any)[attr.name.slice(4)] = state.get();
                        } else if(isRef) {
                            el.removeAttribute(attr.name);
                            state.set((el as any));
                        } else {
                            state.attributes[attr.name].push(el as HTMLElement);
                            el.setAttribute(attr.name, (state.get() ?? '') as string);
                        }
    
                    }
                });
            });

            return htmlAsDom;
        }

        return {
            html: html.trim(),
            hydrate
        };
    }

    return doRender;
}

export const replaceNodesFrom = (value: unknown | NiceComponent<any>, start: Comment, end: Comment) => {
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
        if (valueValue) Array.from(valueValue.hydrate().children).reverse().forEach((child) => start.after(child));
    } else {
        const valueAsArray = Array.isArray(value) ? value : [value];
        const keys = valueAsArray.map((v) => {
            if (typeof v === 'object' && (v as any).type === 'component') {
                const newValueComponent = v as unknown as NiceComponent<any>;
                return newValueComponent.key ?? newValueComponent.id;
            } else {
                return undefined;
            }
        }).filter((v) => v !== undefined);

        const valuesToRender = valueAsArray.map((v) => {
            if (typeof v === 'object' && (v as any).type === 'component') {
                console.log('RendernChild', v, v.properties);
                const newValueComponent = v as unknown as NiceComponent<any>;
                const renderResult = newValueComponent.render(newValueComponent.id).hydrate();
                if (renderResult.children[0] && v.key) renderResult.children[0].setAttribute('data-nice-key', v.key);
                console.log(renderResult.children[0])
                return renderResult;
            } else {
                return v;
            }
        });

        if (!keys.length) {
            childrenBetweenMarkers.forEach((node) => node!.remove());
            valuesToRender.reverse().forEach((valueValue) => {
                if (valueValue instanceof HTMLElement) Array.from(valueValue.children).reverse().forEach((child) => start.after(child));
                else {
                    const text = document.createTextNode(valueValue as string);
                    start.after(text);
                }
            });
        } else {
            childrenBetweenMarkers.forEach((node) => {
                if(!keys.includes((node! as HTMLElement).getAttribute('data-nice-key')!)) {
                    node!.remove()
                }
            });
            valuesToRender.reverse().forEach((valueValue) => {
                if (valueValue instanceof HTMLElement) {
                    let prev: HTMLElement | null = null;
                    Array.from(valueValue.children).reverse().forEach((child) => {
                        if (!start.parentElement?.querySelector(`[data-nice-key="${(child as HTMLElement).getAttribute('data-nice-key')!}"]`))  {
                            const previous = prev ?? end;
                            previous.before(child);
                        }
                        prev = child as HTMLElement;
                    });
                } else {
                    const text = document.createTextNode(valueValue as string);
                    start.after(text);
                }
            });
        }
    }
}

const renderAsHTML = (html: string) => {
    const dom = document.createElement('div');
    dom.innerHTML = html;

    return dom;
}

const matchAttributeBinding = (str: string) => {
    const regex = /.+\b(.+)="?$/gm;
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