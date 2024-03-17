import { component, render } from "../../nice";
import { globalStore } from "../example-app";

export const Logo = component(() => {
    const name = globalStore('appName');

    return render`
        <h1 class='logo'>
            ${name}
        </h1>
    `
});