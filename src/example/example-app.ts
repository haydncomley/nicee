import { app, render, store } from "../nice";
import { HeroSection } from "./sections/hero";
import { ThemeWidget } from "./components/theme-widget";

import './reset.scss';
import './styles.scss';

export const [ globalStore ] = store({
    appName: 'haydn',
    isMenuOpen: false,
});
  
app('#app', () => {
    return render`
        <main>
            ${HeroSection({})}
            ${ThemeWidget()}
        </main>
    `;
});