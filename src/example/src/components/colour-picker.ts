import { component, computed, hasWindow, ref, render, state, type Prop, styler, valueOf, type State, mapper } from "../../../nice";

import styles from './colour-picker.module.scss'

const colors = [
    { label: 'Red', hex: '#dd1364' },
    { label: 'Orange', hex: '#fccb19' },
    { label: 'Green', hex: '#07d907' },
    { label: 'Blue', hex: '#379bff' },
    { label: 'Indigo', hex: '#8334bc' },
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

    const renderColours = computed(() => {
        return mapper(colors, (colour) => {
            const buttonClass = `${styles.colourPickerItem} ${colour.hex === valueOf(selected) ? styles.colourPickerItemSelected : ''}`

            return render`
            <button 
                class=${buttonClass}
                style="--colour: ${colour.hex};"
                on-click=${onClick}
                data-colour=${colour.hex}>
                ${colour.label}
            </button>
            `;
        });
    }, [selected]);

    return render`
        <div class=${pickerClass}>
            <div class=${styles.colourPickerInner}>
                ${renderColours}
            </div>
        </div>
    `
});
