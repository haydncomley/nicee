import { component, computed, render, state } from "../nice";

export const SmallComponent = component(() => {
    const count = state(1);

    const countIsEven = computed(() => {
        return (count.get() % 2 === 0) ? 'Small Even' : 'Small Odd';
    }, [count]);
    
    // setInterval(() => {
    //     count.set(count.get() + 1);
    // }, 200);
    
    return render`<small>${countIsEven}</small>`;
});