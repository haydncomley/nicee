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

                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <path d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"/>
                </svg>
            </button>

            <div class=${styles.navContent}>
                ${Link({ isExternal: true, label: 'Portfolio', url: "https://github.com/haydncomley" })}
                <span class=${styles.navDivide}>•</span>
                ${Link({ isExternal: true, label: 'Blog', url: "https://github.com/haydncomley" })}
                <span class=${styles.navDivide}>•</span>
                ${Link({ isExternal: true, label: 'GitHub', url: "https://github.com/haydncomley" })}
            </div>
        </nav>
    `
});