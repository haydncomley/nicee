import { NiceProp } from "./nice-state";

export const mapper = <T = number>(data: T, fn: ((value: T, index: number) => any)) => {
    let array: any[] = [];
    if (typeof data === 'number') {
        array = Array.from({ length: data }, (_, i) => i + 1);
    } else if (typeof data === 'object') {
        array = Array.from(Object.entries(data as any));
    } else if (Array.isArray(data)) {
        array = data;
    }

    return array.map((value, index) => fn(value, index));
}

export const valueOf = <T extends NiceProp<any>>(property: T): T extends NiceProp<infer U> ? U : never => {
    return (typeof property === 'object' && Object.hasOwn(property as any, 'get')) ? (property as any).get() : property;
}