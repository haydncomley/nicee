import { type NiceProp, type NiceState, component, computed, render, valueOf } from "../../../nice";

import styles from './button.module.scss'

export const Button = component<{
    label: NiceProp<string>
    onClick?: NiceState<MouseEvent>
}>(({
    label,
    onClick,
}) => {
    const buttonLabel = computed(() => {
        return valueOf(label);
    }, [label])

    const onButtonClick = computed<MouseEvent>((e) => {
        if (onClick) onClick.set(e);
    });

    return render`
        <button class=${styles.button} on-click=${onButtonClick}>
            <span>${buttonLabel}</span>
        </button>
    `
});