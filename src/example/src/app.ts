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
        switch (path) {
            default: 
                return Home();
            case '/blog':
                return Blog();
        }
    });
};