import { app as niceApp, store } from "../../nice";
import { Blog } from "./pages/blog";
import { Home } from "./pages/home";

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
                return Home();
            case '':
                return Home();
            case 'blog':
                return Blog();
        }
    });
};