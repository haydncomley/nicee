import { component, computed, mapper, render, state } from "../../nice";
import { Bar } from "../components/bar";
import { Button } from "../components/button";
import { Logo } from "../components/logo";

import styles from './hero.module.scss';

export const HeroSection = component<{
    scrollNote?: string
}>(({ 
    scrollNote
 }) => {
    const count = state(0);
    
    const addCount = computed<MouseEvent>(() => {
        count.set(count.get() + 1);
    });

    const buttonLabel = computed(() => {
        return `Count ${count.get()}`;
    }, [count]);

    const backgroundBars = computed(() => {
        return mapper(count.get(), (i) => Bar({ value: i, isInstant: i < count.get() }));
    }, [count])

    return render`
        <section class=${styles.fullPage}>
            <div class=${styles.fullPageBars}>
                ${backgroundBars}
            </div>

            <div class=${styles.fullPageContent}>
                ${Logo()}
                ${Button({ label: buttonLabel, onClick: addCount })}
            </div>

            <span class=${styles.fullPageTag}>${scrollNote}</span>
        </section>
    `
});