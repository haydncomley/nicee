import { component, render } from "../../../nice";

import styles from './project-card.module.scss'

export const ProjectCard = component(() => {
    const url = "https://images.unsplash.com/photo-1682687221323-6ce2dbc803ab?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
                <img src=${url} />
            </div>
        </article>
    `
});