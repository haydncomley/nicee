import { component, render, type NiceProp, type ComponentType, computed, mapper, valueOf } from "../../../nice";
import { ProjectCard } from "../components/project-card";
import { OutRankedProject } from "../data/projects.data";

import styles from './project-showcase.module.scss';

export const ProjectShowcaseSection = component<{
    title: NiceProp<string>,
    projects: NiceProp<ComponentType<typeof ProjectCard>>[]
}>(({
    title,
    projects
}) => {
    const renderProjects = computed(() => {
        return mapper(projects, (project) => render`<span>${ProjectCard(valueOf(project), valueOf(valueOf(project).title))}</span>`);
    }, [projects]);

    return render`
        <section class=${styles.projectShowcase}>
            <h4 class=${styles.projectShowcaseTitle}>
                ▲ ${title} ◆
            </h4>
            <div class=${styles.projectShowcaseContent}>
                ${renderProjects}
            </div>
        </section>
    `
});