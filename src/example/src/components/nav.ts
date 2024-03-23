import { component, computed, render } from "../../../nice";
import { globalStore } from "../app";
import { Link } from "./link";

import styles from './nav.module.scss'

export const Navigation = component(() => {
    const isNavOpen = globalStore('isNavOpen');

    const toggleNav = computed(() => {
        isNavOpen.set(!isNavOpen.get());
    });

    return render`
        <nav class=${styles.nav} data-is-open=${isNavOpen}>
            <button class=${styles.navButton} on-click=${toggleNav}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path d="M4 18L20 18" stroke-width="2" stroke-linecap="round"/>
                    <path d="M4 12L20 12" stroke-width="2" stroke-linecap="round"/>
                    <path d="M4 6L20 6" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>

            <div class=${styles.navContent}>
                ${Link({ isExternal: true, label: 'About', url: "https://github.com/haydncomley" })}
                <span class=${styles.navDivide}>•</span>
                ${Link({ isExternal: true, label: 'GitHub', url: "https://github.com/haydncomley" })}
            </div>
        </nav>
    `
});