import type { ComponentType } from "../../../nice";
import { ProjectCard } from "../components/project-card";
import { NiceeGitHub } from "./links.data";

import TestImg from './project-imgs/test-2.webp'

export const OutRankedProject: ComponentType<typeof ProjectCard> = {
    image: TestImg.src,
    tag: 'Social App',
    techStack: ['React', 'Ionic'],
    title: 'OutRanked',
    link: 'https://outranked.app',
    isExternal: true,
}

export const GetCardsProject: ComponentType<typeof ProjectCard> = {
    image: TestImg.src,
    tag: 'Mobile Game',
    techStack: ['React', 'Firebase'],
    title: 'GetCards',
    link: 'https://apps.apple.com/gb/app/getcards/id1410296798',
    isExternal: true,
}

export const NiceeLibProject: ComponentType<typeof ProjectCard> = {
    image: "/test-image.webp",
    tag: 'Web Framework',
    techStack: ['OSS'],
    title: 'Nicee',
    link: NiceeGitHub.url,
    isExternal: true,
}

export const FeaturedProject: ComponentType<typeof ProjectCard> = OutRankedProject;
export const RecentProjects: ComponentType<typeof ProjectCard>[] = [
    OutRankedProject,
    NiceeLibProject,
    GetCardsProject,
];
