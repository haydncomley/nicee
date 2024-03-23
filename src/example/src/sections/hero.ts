import { component, computed, mapper, render } from "../../../nice";
import { globalStore } from "../app";
import { Button } from "../components/button";
import { Link } from "../components/link";
import { Logo } from "../components/logo";
import { ProjectCard } from "../components/project-card";
import { Star } from "../components/star";
import { NiceeGitHub } from "../data/links.data";
import { FeaturedProject, OutRankedProject } from "../data/projects.data";

import styles from './hero.module.scss';

export const HeroSection = component(() => {
    const count = globalStore('globalCount');
    
    const addCount = computed<MouseEvent>(() => {
        count.set(count.get() + 1);
    });

    const buttonLabel = computed(() => {
        const value = count.get();
        return  value ? `Count ${value}` : 'Click Me';
    }, [count]);

    const stars = computed(() => {
        return mapper(count.get(), (value) => Star({ value }, String(value)));
    }, [count])

    return render`
        <header class=${styles.fullPage}>
            <div class=${styles.fullPageBackground}>${stars}</div>

            <div class=${styles.fullPageInner}>
                <div class=${styles.fullPageContent}>
                    ${Logo()}
                    ${Button({ label: buttonLabel, onClick: addCount })}
                </div>

                <div class=${styles.fullPageNote}>
                    <small>made using a nicee framework</small>
                    <span>Check it out now : ${Link(NiceeGitHub)}</span>
                </div>

                <div class=${styles.fullPageFeature}>
                    <p>Looking for something cool?</p>
                    ${ProjectCard(FeaturedProject)}
                </div>
            </div>
        </header>
    `
});