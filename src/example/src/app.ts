import { app as niceApp, store } from "../../nice";
import { Blog } from "./app/blog";
import { Error } from "./app/error";
import { Home } from "./app/home";

export const globalStore = store({
    appName: 'haydn',
    isNavOpen: false,
    globalCount: 0,
});

export default (path?: string) => {
    return niceApp(() => {
        let trimmedPath = path?.trim();
        if (trimmedPath?.endsWith('/')) trimmedPath = trimmedPath.slice(0, -1);
        if (trimmedPath?.startsWith('/')) trimmedPath = trimmedPath.slice(1);

        switch (trimmedPath) {
            default: 
                return Error();
            case '':
                return Home();
            case 'blog':
                return Blog();
        }
    });
};