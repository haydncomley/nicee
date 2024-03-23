import { component, computed, hasWindow, render, state, styler } from "../../../nice";
import { deterministicRandom } from "../lib/utils";

import styles from './star.module.scss';

const getLocation = (num: number) => {
    if (num === 0) return 0;
    else return deterministicRandom(num, 0, 100);
}

const getRotation = (num: number) => {
    if (num === 0) return 0;
    else return deterministicRandom(num, 0, 180);
}

const getShape = (num: number) => {
    switch (deterministicRandom(num, 1, 4)) {
        default:
        case 1:
            return styles.square;
        case 2:
            return styles.circle;
        case 3:
            return styles.triangle;
        case 4:
            return styles.burst;
    }
}

export const Star = component<{
    value: number
    key?: number
}>(({
    value,
}) => {
    const x = state(getLocation(value));
    const y = state(getLocation(value * 4321));

    const style = computed(() => styler({
        display: hasWindow ? 'block' : 'none',
        left: `${x.get()}%`,
        top: `${y.get()}%`,
        transform: `rotateZ(${getRotation(value)}deg) translate(-50%, -50%)`,
    }), [x, y]);

    const starClass = computed(() => `${getShape(value)} ${styles.star}`, [value]);

    return render`<span class=${starClass} style=${style}><span></span></span>`
});