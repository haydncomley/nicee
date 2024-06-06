import { render } from "../../../nice";
import { Navigation } from "../components/nav";
import { ThemeWidget } from "../components/theme-widget";
import { CalloutSection } from "../sections/callout";
import { Footer } from "../sections/footer";


export const Error = () => render`
<main>
    ${ThemeWidget()}
    ${Navigation()}

    ${CalloutSection({ header: 'Something went wrong.' })}

    ${Footer()}
</main>
`;