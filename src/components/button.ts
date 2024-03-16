import { component, computed, render } from "../nice";

export const Button = component<{ count: number }>(({ count }) => {
    const buttonClass = computed(() => {
        return `my-class-${count.get()}`
    }, [count])

    const onClick = computed<MouseEvent>(() => {
        count.set(count.get() + 1);
    })

    return render`
        <button class="${buttonClass}" on-click="${onClick}">
            My Button ${count}
        </button>
    `;
});