import { NiceNode } from "../nice";
import { NiceComponent } from "./nice-component";
import { NiceState } from "./nice-state";

export type NiceRenderTemplate = TemplateStringsArray;
export type NiceRenderArgs = NiceNode[];

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
                const isRef = attr.name === 'ref';
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