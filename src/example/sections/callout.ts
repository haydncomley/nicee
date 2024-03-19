import { NiceProp, component, render } from "../../nice";

import styles from './callout.module.scss';

export const CalloutSection = component<{
    header: NiceProp<string>,
    subheader?: NiceProp<string>,
}>(({ 
    header,
    subheader
 }) => {
    return render`
        <section class=${styles.calloutSection}>
            <h3>${header}</h3>
            <p>Subheader</p>
        </section>
    `
});