import { NiceState, component, computed, render } from "../nice";

export const Button = component<{ count: NiceState<number>, extra: number }>(({ count, extra }) => {
    const buttonClass = computed(() => {
        return `my-class-${count.get()}`
    }, [count])

    const buttonText = computed(() => {
        return `My Button ${count.get()} ${extra}`
    }, [count]);

    const onClick = computed<MouseEvent>(() => {
        count.set(count.get() + 1);
    })

    return render`
        <button class="${buttonClass}" on-click="${onClick}">
            My Button ${buttonText}
        </button>
    `;
});