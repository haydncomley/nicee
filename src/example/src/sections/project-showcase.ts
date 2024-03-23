import { component, render } from "../../../nice";
import { ProjectCard } from "../components/project-card";

import styles from './project-showcase.module.scss';

export const ProjectShowcaseSection = component(() => {
    return render`
        <section class=${styles.projectShowcase}>
            <h4 class=${styles.projectShowcaseTitle}>
                ▲ Recent Projects ◆
            </h4>
            <div class=${styles.projectShowcaseContent}>
                <span>
                    ${ProjectCard()}
                </span>
                <span>
                    ${ProjectCard()}
                </span>
                <span>
                    ${ProjectCard()}
                </span>
            </div>
        </section>
    `
});