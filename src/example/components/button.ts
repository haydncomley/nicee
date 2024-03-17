import { NiceProp, component, computed, render, valueOf } from "../../nice";

export const Button = component<{
    label: NiceProp<string>
}>(({
    label,
}) => {
    const buttonLabel = computed(() => {
        return valueOf(label);
    }, [label])

    return render`
        <button>
            ${buttonLabel}
        </button>
    `
});