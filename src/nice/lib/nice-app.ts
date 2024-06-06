import { component } from "./nice-component";
import { render } from "./nice-renderer";
import { nextId } from "./utils";

export const app = (fn: () => ReturnType<typeof render> | void, selector?: string) => {
    
    const rootComponent = component(fn)();
    
    if (selector && typeof window !== 'undefined') {
        const root = selector ? document.querySelector(selector) : undefined;
        if (!root) throw new Error(`Failed to attach - Element "${selector}" not found in the DOM.`);

        rootComponent.markDirty = () => {
            const html = rootComponent.render(nextId());
            if (!html) return;
    
            while (root.firstChild) {
                root.removeChild(root.firstChild);
            }
    
            if (window) {
                Array.from(html.hydrate().children).forEach((child) => {
                    root.appendChild(child);
                });
            } else {
                root.innerHTML = html.html;
            }
        }
    
        rootComponent.markDirty();
    } else {
        return {
            html: rootComponent.render('nice-app-root').html,
            id: 'nice-app-root',
            hydrate: (id: string) => {
                const root = document.querySelector(`#${id}`) ;
                if (!root) throw new Error(`Failed to attach - Element "${selector}" not found in the DOM.`);
        

                rootComponent.markDirty = () => {
                    const html = rootComponent.render(nextId());
                    if (!html) return;
            
                    while (root.firstChild) {
                        root.removeChild(root.firstChild);
                    }
            
                    if (window) {
                        Array.from(html.hydrate().children).forEach((child) => {
                            root.appendChild(child);
                        });
                    } else {
                        root.innerHTML = html.html;
                    }
                }
            
                rootComponent.markDirty();
            }
        };
    }
};