import { component } from "./nice-component";
import { render } from "./nice-renderer";
import { nextId } from "./utils";

export const app = (selector: string, fn: () => ReturnType<typeof render> | void) => {
    const root = document.querySelector(selector);
    if (!root) throw new Error(`Failed to attach - Element "${selector}" not found in the DOM.`);

    const rootComponent = component(fn)({});

    rootComponent.markDirty = () => {
        const html = rootComponent.render(nextId());
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