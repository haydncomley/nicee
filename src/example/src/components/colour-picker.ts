import { component, computed, hasWindow, ref, render, state, type Prop, styler, valueOf, type State, mapper } from "../../../nice";

import styles from './colour-picker.module.scss'

export const colors = [
    { label: 'Red', hex: '#dd1364' },
    { label: 'Orange', hex: '#fccb19' },
    { label: 'Green', hex: '#07d907' },
    { label: 'Blue', hex: '#379bff' },
    { label: 'Indigo', hex: '#8334bc' },
    { label: 'Slate', hex: '#6b6564' },
];

export const ColourPicker = component<{
    isOpen: Prop<boolean>
    selected?: Prop<string>,
    onChange?: State<string>
}>(({
    isOpen,
    onChange,
    selected,
}) => {
    const pickerClass = computed(() => {
        return `${styles.colourPicker} ${valueOf(isOpen) ? styles.colourPickerOpen : ''}`;
    }, [isOpen]);

    const onClick = computed<MouseEvent>((e) => {
        const clickedHex = (e.target as HTMLButtonElement).dataset.colour;
        if (clickedHex) onChange?.set(clickedHex);
    })

    const Color = component<{ hex: string }>(({ hex }) => {
        const buttonClass = computed(() => {
            return `${styles.colourPickerItem} ${hex === valueOf(selected) ? styles.colourPickerItemSelected : ''}`;
        }, [selected])

        return render`
        <button 
            class=${buttonClass}
            style="--colour: ${hex};"
            on-click=${onClick}
            data-colour=${hex}>
        </button>
        `
    });

    const renderColours = computed(() => {
        return mapper(colors, (colour) => Color({ hex: colour.hex }, colour.hex));
    }, [selected]);

    return render`
        <div class=${pickerClass}>
            <div class=${styles.colourPickerInner}>
                ${renderColours}
            </div>
        </div>
    `
});
