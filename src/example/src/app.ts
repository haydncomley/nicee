import { app, render, store } from "../../nice";
import { Navigation } from "./components/nav";
import { ThemeWidget } from "./components/theme-widget";
import { RecentProjects } from "./data/projects.data";
import { CalloutSection } from "./sections/callout";
import { Footer } from "./sections/footer";
import { HeroSection } from "./sections/hero";
import { ProjectShowcaseSection } from "./sections/project-showcase";

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
                ${ProjectShowcaseSection({
                    projects: RecentProjects,
                    title: 'Recent Projects'
                })}

                ${Footer()}
          </main>
      `;
  });