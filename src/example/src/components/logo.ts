import { component, render } from "../../../nice";
import { globalStore } from "../app";

import styles from './logo.module.scss'

export const Logo = component(() => {
    const name = globalStore('appName');

    return render`
        <h1 class=${styles.logo}>
            ${name}
        </h1>
    `
});