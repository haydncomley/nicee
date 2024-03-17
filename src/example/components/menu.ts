import { component, computed, render } from "../../nice";
import { globalStore } from "../example-app";

export const Menu = component(() => {
    const isMenuOpen = globalStore('isMenuOpen');

    const menuStyles = computed(() => {
        return isMenuOpen.get() ? 'test2' : undefined;
    }, [isMenuOpen]);

    return render`
        <nav class=${menuStyles}>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
        </nav>
    `
});