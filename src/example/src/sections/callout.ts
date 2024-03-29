import { type NiceProp, component, render, ref, computed } from "../../../nice";

import styles from './callout.module.scss';

export const CalloutSection = component<{
    header: NiceProp<string>,
    subheader?: NiceProp<string>,
}>(({ 
    header,
    subheader
 }) => {
    const mouseFollowerRef = ref<HTMLSpanElement>()

    computed(() => {
        if (!mouseFollowerRef.get()) return;

        const mouseFollower = mouseFollowerRef.get();
        const mouseMoveHandler = (e: MouseEvent) => {
            const parent = mouseFollower.parentElement;
            const offset = parent!.getBoundingClientRect();

            // const isTarget = e.target === mouseFollower || mouseFollower.parentElement!.contains(e.target as Node);
            // console.log(e.target)

            mouseFollower.style.left = `${e.clientX - offset.x}px`;
            mouseFollower.style.top = `${e.clientY - offset.y}px`;
        }

        window.addEventListener('mousemove', mouseMoveHandler);
    }, [mouseFollowerRef]);

    return render`
        <section class=${styles.calloutSection}>
            <span ref=${mouseFollowerRef} class=${styles.calloutSectionMouse}></span>

            <h3 class=${styles.calloutSectionHeader}>${header}</h3>
            <p class=${styles.calloutSectionSubheader}>${subheader}</p>
        </section>
    `
});