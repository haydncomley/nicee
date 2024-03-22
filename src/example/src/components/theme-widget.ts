import { component, computed, hasWindow, ref, render, state } from "../../../nice";
import { hexToRgb, rgbToHex, shiftHue } from "../lib/utils";
import { Button } from "./button";

import styles from './theme-widget.module.scss'

export const ThemeWidget = component(() => {
    const inputRef = ref<HTMLDivElement>();
    const currentColor = state(hasWindow ? getComputedStyle(document.body).getPropertyValue('--theme-primary') : '');
    const currentColorHex = computed(() => rgbToHex(currentColor.get()), [currentColor]);

    const onColorChange = computed<MouseEvent>((e) => {
        const inputElement = e.target as HTMLInputElement;
        currentColor.set(hexToRgb(inputElement.value));
    });

    computed(() => {
        if (hasWindow) {
            const body = document.querySelector('body');
            body!.style.setProperty('--theme-primary', currentColor.get());
            body!.style.setProperty('--theme-secondary', shiftHue(currentColor.get(), .2));
        }
    }, [currentColor]);

    const onClick = computed<MouseEvent>(() => {
        const input = inputRef.get();
        if (!input) return;
        input.click();
    })

    return render`
        <div class=${styles.themeWidget} on-click=${onClick}>
            ${Button({ label: 'Change Theme', onClick })}
            <input type="color" ref=${inputRef} on-input=${onColorChange} set-value=${currentColorHex}>
        </div>
    `
});
