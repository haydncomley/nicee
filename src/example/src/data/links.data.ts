import type { ComponentType } from "../../../nice";
import type { Link } from "../components/link";

export const SocialGitHub: ComponentType<typeof Link> = {
    label: 'GitHub',
    url: "https://github.com/haydncomley",
    isExternal: true
}

export const SocialYouTube: ComponentType<typeof Link> = {
    label: 'YouTube',
    url: "https://youtube.com/haydncomley",
    isExternal: true
}

export const SocialLinkedIn: ComponentType<typeof Link> = {
    label: 'LinkedIn',
    url: "https://linkedin.com/in/haydn-comley",
    isExternal: true
}

export const NiceeGitHub: ComponentType<typeof Link> = {
    label: 'View Source',
    url: "https://github.com/haydncomley/nicee",
    isExternal: true
}