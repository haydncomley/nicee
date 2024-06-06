import { component, render } from "../../../nice";
import { Link } from "../components/link";
import { LinkBlog, LinkContact, SocialGitHub, SocialLinkedIn, SocialYouTube } from "../data/links.data";

import styles from './footer.module.scss';

export const Footer = component(() => {

    return render`
        <footer class=${styles.footer}>
            <div class=${styles.footerInner}>
                <h4 class=${styles.footerTitle}>Hey there!</h4>
                <small class=${styles.footerInfo}>I hope you're finding everything you need,\nIf not then shoot me an email or send a message.</small>

                <div class=${styles.footerContent}>
                    <div class=${styles.footerColumn}>
                        <p class=${styles.footerBody}>Quick Links</p>
                        ${Link(LinkContact)}
                        ${Link(LinkBlog)}
                    </div>

                    <div class=${styles.footerColumn}>
                        <p class=${styles.footerBody}>Social Media</p>
                        ${Link(SocialLinkedIn)}
                        ${Link(SocialGitHub)}
                        ${Link(SocialYouTube)}
                    </div>
                </div>
            </div>
        </section>
    `
});