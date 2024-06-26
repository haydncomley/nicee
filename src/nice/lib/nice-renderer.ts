import type { Component, Node } from "./nice-component";
import { State } from "./nice-state";

export type RenderTemplate = TemplateStringsArray;
export type RenderArgs = Node[];
export type RenderFunctionReturn = ReturnType<typeof render>;

export const render = (template: RenderTemplate, ...args: RenderArgs) => {
    const debugRender = false;
    
    const doRender = (id: string) => {
        const prefixComment = `<!-- ${id} BEGIN -->`;
        const suffixComment = `<!-- ${id} END -->`;

        let html = '';
        if(debugRender) html += prefixComment;

        const childrenToReattach: Record<string, { html: string; hydrate: () => HTMLDivElement; }> = {};
        const stateToReattach: Record<string, State<any>> = {};

        template.forEach((block, index) => {
            let nextVar = args[index];
            html += block;
            if (nextVar === undefined) return;
            
            const isAttributeBind = matchAttributeBinding(block);
            const randomId = Math.random().toString(36).substring(7);

            if (typeof nextVar !== 'object') {
                if (isAttributeBind && !block.endsWith('"')) {
                    html += `"${nextVar}"`;
                } else {
                    html += nextVar;
                }
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
                    const newValueComponent = stateToRender as unknown as Component<any>;
                    value = newValueComponent.render(newValueComponent.id).html;
                } else if (Array.isArray(stateToRender)) {
                    extraItems = stateToRender.length;
                    value = stateToRender.map((v) => {
                        if (typeof v === 'object' && (v as any).type === 'component') {
                            const newValueComponent = v as unknown as Component<any>;
                            return newValueComponent.render(newValueComponent.id).html;
                        } else {
                            return v;
                        }
                    }).join('');
                }
            }

            const replacer = isAttributeBind ? `"${value ? value : ''}" data-bind-${isAttributeBind}="${id}"` : `<!-- @ -->${value}<span style="display: none;" data-reattach-state="${id}" data-reattach-extras="${!!value && extraItems}"></span><!-- # -->`;
            html = html.replace(id, replacer);
        });

        const hydrate = () => {
            const htmlAsDom = renderAsHTML(html);
            htmlAsDom.children[0].setAttribute('data-nice-id', id)
    
            Object.keys(stateToReattach).forEach((id) => {
                htmlAsDom.querySelectorAll(`[data-reattach-state="${id}"]`).forEach((el) => {
                    const removeExtras = el.getAttribute('data-reattach-extras');
                    if (removeExtras && removeExtras !== 'false') {
                        for (let i = 0; i < parseInt(removeExtras); i++) el.previousSibling?.remove();
                    }
                    let value = stateToReattach[id].get();

                    let prev = el.previousSibling;
                    let next = el.nextSibling;

                    while(prev && prev.nodeType !== Node.COMMENT_NODE) {
                        prev = prev.previousSibling;
                    }
    
                    stateToReattach[id].markers.push([
                        prev as Comment,
                        next as Comment,
                    ]);
    
                    replaceNodesFrom(value, prev as Comment, next as Comment);
                });
            });
    
            Object.keys(childrenToReattach).forEach((id) => {
                htmlAsDom.querySelectorAll(`[data-reattach-child="${id}"]`).forEach((el) => {
                    const child = (childrenToReattach[id].hydrate()).children[0]
                    el.replaceWith(child);
                });
            });
    
            htmlAsDom.querySelectorAll('*').forEach((el) => {
                Array.from(el.attributes).forEach((attr) => {
                    const stateId = attr.name.match(/data-bind-(.+)$/);
                    
                    if (stateId) {
                        const key = stateId[1].trim();
                        const id = attr.value;

                        const isAction = key.startsWith('on-');
                        const isSetter = key.startsWith('set-');
                        const isRef = key === 'ref';

                        const state = stateToReattach[id];
                        if (!state) return;
                        if (!state.attributes[key]) state.attributes[key] = [];
    
                        if (isAction) {
                            el.removeAttribute(key);
                            el.addEventListener(key.slice(3), (e) => state.set(e as any));
                        } else if (isSetter) {
                            el.removeAttribute(key);
                            state.listen((newValue) => {
                                (el as any)[key.slice(4)] = newValue;
                            });
                            (el as any)[key.slice(4)] = state.get();
                        } else if(isRef) {
                            el.removeAttribute(key);
                            state.set((el as any));
                        } else {
                            state.attributes[key].push(el as HTMLElement);
                            el.setAttribute(key, (state.get() ?? '') as string);
                        }
    
                        el.removeAttribute(attr.name);
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

export const replaceNodesFrom = (value: unknown | Component<any>, start: Comment, end: Comment) => {
    const childrenBetweenMarkers: (Text | HTMLElement)[] = [];
    let next: ChildNode | null | undefined = start.nextSibling;

    while (next !== end) {
        childrenBetweenMarkers.push(next as Text);
        next = next?.nextSibling;
    }


    if (value && typeof value === 'object' && (value as any).type === 'component') {
        const newValueComponent = value as unknown as Component<any>;
        const valueValue = newValueComponent.render(newValueComponent.id);
        childrenBetweenMarkers.forEach((node) => node!.remove());
        if (valueValue) Array.from(valueValue.hydrate().children).reverse().forEach((child) => start.after(child));
    } else {
        const valueAsArray = Array.isArray(value) ? value : [value];
        const keys = valueAsArray.map((v) => {
            if (typeof v === 'object' && (v as any).type === 'component') {
                const newValueComponent = v as unknown as Component<any>;
                return newValueComponent.key ?? newValueComponent.id;
            } else {
                return undefined;
            }
        }).filter((v) => v != undefined);

        const valuesToRender = valueAsArray.map((v) => {
            let subValue = v;
            if (typeof v === 'function') subValue = v();

            if (typeof subValue === 'object' && (subValue as any).type === 'component') {
                const newValueComponent = subValue as unknown as Component<any>;
                const renderResult = newValueComponent.render(newValueComponent.id).hydrate();
                if (renderResult.children[0] && subValue.key) renderResult.children[0].setAttribute('data-nice-key', subValue.key);
                return renderResult;
            } else {
                return subValue;
            }
        }).filter((v) => v != undefined);

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
    const regex = /.+ (.+)="?$/gm;
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