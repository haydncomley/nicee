import { app, render, store } from "../../nice";
import { Navigation } from "./components/nav";
import { ThemeWidget } from "./components/theme-widget";
import { CalloutSection } from "./sections/callout";
import { Footer } from "./sections/footer";
import { HeroSection } from "./sections/hero";

export const globalStore = store({
    appName: 'haydn',
    isNavOpen: false,
    globalCount: 0,
});

export const myApp = app(() => {
    return render`
          <main>
                ${ThemeWidget()}
                ${Navigation()}

                ${HeroSection()}
                ${CalloutSection({ header: 'Hello World', subheader: 'This is some more content' })}
                ${HeroSection()}

                ${Footer()}
          </main>
      `;
  });