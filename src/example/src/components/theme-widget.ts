import { component, computed, hasWindow, ref, render, state, valueOf } from "../../../nice";
import { globalStore } from "../app";
import { hexToRgb, rgbToHex, shiftHue } from "../lib/utils";
import { Button } from "./button";
import { ColourPicker } from "./colour-picker";

import styles from './theme-widget.module.scss'

export const ThemeWidget = component(() => {
    const currentColor = globalStore('theme');
    const colourPickerOpen = state(false);

    computed(() => {
        if (hasWindow) {
            const body = document.querySelector('body');
            body!.style.setProperty('--theme-primary', hexToRgb(valueOf(currentColor)));
            body!.style.setProperty('--theme-secondary', shiftHue(hexToRgb(valueOf(currentColor)), .2));
        }
    }, [currentColor]);

    const buttonLabel = computed(() => {
        return valueOf(colourPickerOpen) ? 'Close' : 'Choose Theme' as string;
    }, [colourPickerOpen]);

    const onClick = computed<MouseEvent>(() => {
        colourPickerOpen.set(!colourPickerOpen.get());
    });

    const onChange = computed<string>((e) => {
        document.cookie = `theme=${e}`;
        currentColor.set(e);
        colourPickerOpen.set(false);
    });

    return render`
        <div class="${styles.themeWidget}">
            ${Button({ label: buttonLabel, onClick })}
            ${ColourPicker({ isOpen: colourPickerOpen, onChange: onChange, selected: currentColor })}
        </div>
    `
});
