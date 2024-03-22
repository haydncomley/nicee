import { app, render, store } from "../../nice";
import { ThemeWidget } from "./components/theme-widget";
import { HeroSection } from "./sections/hero";

export const [ globalStore ] = store({
    appName: 'haydn',
    isMenuOpen: false,
});

export const myApp = app(() => {
    return render`
          <main>
                ${ThemeWidget()}

                ${HeroSection({})}
          </main>
      `;
  });