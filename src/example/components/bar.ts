import { component, computed, render, state } from "../../nice";
import { deterministicRandom } from "../lib/utils";

const getHeight = (num: number) => {
    if (num === 0) return 0;
    else return deterministicRandom(num, 5, 35);
}

export const Bar = component<{
    value: number
    isInstant?: boolean
}>(({
    value,
    isInstant = false
}) => {
    const barHeight = state(getHeight(isInstant ? value : 0));

    const barStyle = computed(() => {
        return `height: ${barHeight.get()}vh; ${barHeight.get() ? '' : 'flex-basis: 0;'} ${isInstant ? 'animation: none;' : ''}`;
    }, [barHeight])

    setTimeout(() => {
        barHeight.set(getHeight(value));
    }, 1);

    return render`
        <div class="animatedBar" style=${barStyle}>
        </div>
    `
});