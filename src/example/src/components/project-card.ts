import { component, render, type Prop, computed, valueOf } from "../../../nice";

import styles from './project-card.module.scss'

export const ProjectCard = component<{
    title: Prop<string>;
    tag: Prop<string>;
    image: Prop<string>;
    techStack: Prop<string[]>;
    link: Prop<string>;
    isExternal?: Prop<boolean>;
}>(({
    title,
    tag,
    image,
    techStack,
    link,
    isExternal,
}) => {
    const techStackList = computed(() => valueOf(techStack).join(' • '), [techStack]);

    const linkTarget = computed(() => {
        return isExternal ? '_blank' : '_self';
    }, [isExternal])

    return render`
        <article class=${styles.projectCard}>
            <div class=${styles.projectCardContent}>
                <p class=${styles.projectCardTitle}>${title}</p>
                <p class=${styles.projectCardBody}>${tag}</p>

                <div class=${styles.projectCardFooter}>
                    <p class=${styles.projectCardBody}>${techStackList}</p>
                </div>
            </div>

            <div class=${styles.projectCardFeature}>
                <img src=${image} alt="" aria-hidden="true"/>
            </div>

            <a href=${link} target=${linkTarget}></a>
        </article>
    `
});