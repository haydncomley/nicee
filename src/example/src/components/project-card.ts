import { component, render } from "../../../nice";

import styles from './project-card.module.scss'

export const ProjectCard = component(() => {
    const url = "/test-image.webp";

    return render`
        <article class=${styles.projectCard}>
            <div class=${styles.projectCardContent}>
                <p class=${styles.projectCardTitle}>OutRanked</p>
                <p class=${styles.projectCardBody}>Mobile App</p>

                <div class=${styles.projectCardFooter}>
                    <p class=${styles.projectCardBody}>React • Ionic</p>
                </div>
            </div>

            <div class=${styles.projectCardFeature}>
                <img src=${url} alt="" aria-hidden="true"/>
            </div>
        </article>
    `
});