import { NiceState, state } from "./nice-state";

export const store = <T = object>(values: T) => {
    const theStore = Object.entries(values as { [s: string]: unknown }).reduce((acc, [key, value]) => {
        acc[key] = state(value);
        return acc;
    }, {} as Record<string, NiceState<any>>);
    
    return [
        (key: keyof T) => theStore[key as string]
    ]
}