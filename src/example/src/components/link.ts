import { type Prop, component, computed, render, valueOf } from "../../../nice";

import styles from './link.module.scss'

export const Link = component<{
    label: Prop<string>
    url: Prop<string>
    isExternal?: Prop<boolean>
}>(({
    label,
    url,
    isExternal
}) => {
    const linkTarget = computed(() => {
        return isExternal ? '_blank' : '_self';
    }, [isExternal])

    const labelText = computed(() => {
        return valueOf(label).trim();
    }, [label])

    const labelTextWhole = computed(() => {
        return valueOf(label).trim().replaceAll(' ', '_');
    }, [label])

    return render`
    <a class=${styles.link} target=${linkTarget} href=${url}>
        ${labelText}
        <span class=${styles.linkWiggle} data-label=${labelTextWhole}></span>
    </a>`
});