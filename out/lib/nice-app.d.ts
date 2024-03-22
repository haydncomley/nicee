import { render } from "./nice-renderer";
export declare const app: (fn: () => ReturnType<typeof render> | void, selector?: string) => {
    html: string;
    id: string;
    hydrate: (id: string) => void;
} | undefined;
