import { render } from "../../../nice";
import { Navigation } from "../components/nav";
import { ThemeWidget } from "../components/theme-widget";
import { RecentProjects } from "../data/projects.data";
import { CalloutSection } from "../sections/callout";
import { Footer } from "../sections/footer";
import { HeroSection } from "../sections/hero";
import { ProjectShowcaseSection } from "../sections/project-showcase";

export const Home = () => render`
<main>
    ${ThemeWidget()}
    ${Navigation()}

    ${HeroSection()}
    
    ${CalloutSection({ header: 'Under Construction' })}
    ${ProjectShowcaseSection({
        projects: RecentProjects,
        title: 'Recent Projects'
    })}

    ${Footer()}
</main>
`;