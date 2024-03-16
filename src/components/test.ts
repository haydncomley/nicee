import { component, computed, render, state } from "../nice";
import { SmallComponent } from "./small";

export const TestComponent = component<{
    label: string
}>((props) => {
    const count = state(1);
    
    const countTimeTen = computed(() => {
        return (count.get() * 10);
    }, [count]);

    const countIsEven = computed(() => {
        return (count.get() % 2 === 0) ? SmallComponent({}) : 'Odd';
    }, [count]);
    
    setInterval(() => {
        count.set(count.get() + 1);
    }, 2000);

    return render`
        <div>
            Is Odd? ${countIsEven}
            <p>Count: ${count}</p>
            <p>Count * 10: ${countTimeTen}</p>
            <span>Label: ${props.label}</span>
        </div>
    `;
});