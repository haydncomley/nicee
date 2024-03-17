import { NiceProp } from "./nice-state";
export declare const mapper: <T = number>(data: T, fn: (value: T, index: number) => any) => any[];
export declare const valueOf: <T extends unknown>(property: T) => T extends NiceProp<infer U> ? U : never;
