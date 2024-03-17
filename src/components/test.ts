import { NiceState, component, computed, render } from "../nice";
import { Button } from "./button";
import { SmallComponent } from "./small";
import { Text } from "./text";

export const TestComponent = component<{
    label: NiceState<string>
    count: NiceState<number>
}>(({ label, count }) => {
    const countTimeTen = computed(() => {
        return (count.get() * 10);
    }, [count]);

    const countIsEven = computed(() => {
        return (count.get() % 2 === 0) ? SmallComponent({}) : Button({ count: countTimeTen, extra: 1 })
    }, [count]);

    return render`
        <div>
            Is Odd? <span>${countIsEven}</span>
            ${Text({ count })}
            <p>Count: ${count}</p>
            <p>Count * 10: ${countTimeTen}</p>
            <span>Label: ${label}</span>
        </div>
    `;
});