import { component, computed, mapper, render, state } from "../../nice";
import { Bar } from "../components/bar";
import { Button } from "../components/button";
import { Logo } from "../components/logo";

export const HeroSection = component(() => {
    const count = state(0);
    
    const addCount = computed<MouseEvent>(() => {
        count.set(count.get() + 1);
    });

    const buttonLabel = computed(() => {
        return `Count ${count.get()}`;
    }, [count]);

    const backgroundBars = computed(() => {
        return mapper(count.get(), (i) => Bar({ value: i, isInstant: i < count.get() }));
    }, [count])

    return render`
        <section class="fullPage">
            <div class="fullPageBars">
                ${backgroundBars}
            </div>

            <div class="fullPageContent">
                ${Logo()}
                ${Button({ label: buttonLabel, onClick: addCount })}
            </div>

            <span class="fullPageTag">
                Scroll Down
            </span>
        </section>
    `
});