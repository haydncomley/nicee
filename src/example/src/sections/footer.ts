import { component, render } from "../../../nice";
import { Link } from "../components/link";

import styles from './footer.module.scss';

export const Footer = component(() => {

    return render`
        <footer class=${styles.footer}>
            <h4 class=${styles.footerTitle}>Howdy,</h4>
            <small class=${styles.footerInfo}>I hope you're finding everything you need.\nIf not then shoot me an email or send me a message.</small>

            <div class=${styles.footerContent}>
                <div class=${styles.footerColumn}>
                    <p class=${styles.footerBody}>Quick Links</p>
                    ${Link({ isExternal: true, label: 'Contact', url: "https://github.com/haydncomley" })}
                    ${Link({ isExternal: true, label: 'Portfolio', url: "https://github.com/haydncomley" })}
                    ${Link({ isExternal: true, label: 'Blog', url: "https://github.com/haydncomley" })}
                </div>

                <div class=${styles.footerColumn}>
                    <p class=${styles.footerBody}>Social Media</p>
                    ${Link({ isExternal: true, label: 'LinkedIn', url: "https://linkedin.com/in/haydn-comley" })}
                    ${Link({ isExternal: true, label: 'GitHub', url: "https://github.com/haydncomley" })}
                    ${Link({ isExternal: true, label: 'Instagram', url: "https://github.com/haydncomley" })}
                    ${Link({ isExternal: true, label: 'YouTube', url: "https://youtube.com/haydncomley" })}
                </div>
            </div>
        </section>
    `
});