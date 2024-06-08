import { component, computed, hasWindow, ref, render, state } from "../../../nice";
import { hexToRgb, rgbToHex, shiftHue } from "../lib/utils";
import { Button } from "./button";
import { ColourPicker } from "./colour-picker";

import styles from './theme-widget.module.scss'

export const ThemeWidget = component(() => {
    const inputRef = ref<HTMLInputElement>();
    const currentColor = state(hasWindow ? getComputedStyle(document.body).getPropertyValue('--theme-primary') : '');
    const currentColorHex = computed(() => rgbToHex(currentColor.get()), [currentColor]);
    const colourPickerOpen = state(false);

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
        colourPickerOpen.set(!colourPickerOpen.get());
    });

    const onChange = computed<string>((e) => {
        console.log('On Change', e);
        currentColor.set(hexToRgb(e));
        colourPickerOpen.set(false);
    });

    return render`
        <div class="${styles.themeWidget}">
            ${Button({ label: 'Change Theme', onClick })}
            <input type="color" ref=${inputRef} on-input=${onColorChange} set-value=${currentColorHex}>
            ${ColourPicker({ isOpen: colourPickerOpen, onChange: onChange, selected: currentColorHex })}
        </div>
    `
});
