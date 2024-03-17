import { NiceState, component, computed, render, state } from "../nice";

export const Text = component<{ count: NiceState<number> }>(({ count }) => {
    const value = state('');
    
    const inputClass = computed(() => {
        return `my-class-${count.get()}`
    }, [count])

    const onChange = computed<KeyboardEvent>((e) => {
        value.set((e.target as HTMLInputElement).value);
    })

    const onClick = computed<KeyboardEvent>((e) => {
        count.set(count.get() + 1);
        value.set('Hello World ' + count.get());
    })

    return render`
        <div>
            <input class="${inputClass}" on-input="${onChange}" on-click="${onClick}" set-value="${value}"></input>
            <pre>Output: ${count} ${value}</pre>
        </div>
    `;
});