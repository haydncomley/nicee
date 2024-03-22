import { component, computed, render, state } from "../../../nice";
import { Button } from "../components/button";
import { Logo } from "../components/logo";

import styles from './hero.module.scss';

export const HeroSection = component<{
    scrollNote?: string
}>(({ 
    scrollNote
 }) => {
    const count = state(2);
    
    const addCount = computed<MouseEvent>(() => {
        count.set(count.get() + 1);
    });

    const buttonLabel = computed(() => {
        return `Count ${count.get()}`;
    }, [count]);

    return render`
        <section class=${styles.fullPage}>
            <div class=${styles.fullPageContent}>
                ${Logo()}
                ${Button({ label: buttonLabel, onClick: addCount })}
            </div>

            <span class=${styles.fullPageTag}>${scrollNote}</span>
        </section>
    `
});