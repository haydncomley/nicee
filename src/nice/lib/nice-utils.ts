import { hasWindow } from "..";
import { component } from "./nice-component";
import { NiceProp } from "./nice-state";
import { camelToKebab } from "./utils";

export const mapper = <T = number>(data: T, fn: ((value: T extends Array<any> ? T[0] : T, index: number) => any)) => {
    let array: any[] = [];
    if (typeof data === 'number') {
        array = Array.from({ length: data }, (_, i) => i + 1);
    }  else if (Array.isArray(data)) {
        array = [...data];
    } else if (typeof data === 'object') {
        array = Array.from(Object.entries(data as any));
    }

    let isComponents = false;
    const mappedArray = array.map((value, index) => {
        const result = fn(value, index);
        if (typeof result === 'function') {
            isComponents = true && hasWindow;
            return component(() => result)();
        } else {
            return result;
        }
    });

    return isComponents ? mappedArray.reverse() : mappedArray;
}

export const valueOf = <T extends NiceProp<any>>(property: T): T extends NiceProp<infer U> ? U : never => {
    return (typeof property === 'object' && Object.hasOwn(property as any, 'get')) ? (property as any).get() : property;
}

export const styler = (styles: { [K in keyof HTMLElement['style']]?: string }) => {
    return Object.entries(styles).reduce((acc, [key, value]) => {
        return `${acc}${camelToKebab(key)}: ${value};`;
    }, '');
}