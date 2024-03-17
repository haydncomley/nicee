import { app, render, store } from "../nice";
import { ThemeWidget } from "./components/theme-widget";

import './reset.css';
import { HeroSection } from "./sections/hero";
import './styles.css';

export const [ globalStore ] = store({
    appName: 'haydn',
    isMenuOpen: false,
});
  
app('#app', () => {
    return render`
        <main>
            ${HeroSection()}
            ${ThemeWidget()}
        </main>
    `;
});