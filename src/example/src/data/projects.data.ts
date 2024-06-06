import type { ComponentType } from "../../../nice";
import { ProjectCard } from "../components/project-card";
import { NiceeGitHub } from "./links.data";

import OutRankedImg from './project-imgs/out-ranked-promo.jpeg'
import GetCardsImg from './project-imgs/get-cards-promo.png'
import NiceeLibImg from './project-imgs/js-logo.png'

export const OutRankedProject: ComponentType<typeof ProjectCard> = {
    image: OutRankedImg.src,
    tag: 'Social App',
    techStack: ['React', 'Hybrid'],
    title: 'OutRanked',
    link: 'https://outranked.app',
    isExternal: true,
}

export const GetCardsProject: ComponentType<typeof ProjectCard> = {
    image: GetCardsImg.src,
    tag: 'Mobile Game',
    techStack: ['Ionic', 'Firebase'],
    title: 'GetCards',
    link: 'https://apps.apple.com/gb/app/getcards/id1410296798',
    isExternal: true,
}

export const NiceeLibProject: ComponentType<typeof ProjectCard> = {
    image: NiceeLibImg.src,
    tag: 'Web Framework',
    techStack: ['Open Source'],
    title: 'nicee',
    link: NiceeGitHub.url,
    isExternal: true,
}

export const FeaturedProject: ComponentType<typeof ProjectCard> = OutRankedProject;
export const RecentProjects: ComponentType<typeof ProjectCard>[] = [
    OutRankedProject,
    NiceeLibProject,
    GetCardsProject,
];
