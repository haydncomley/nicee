import { State } from "./nice-state";
export declare const store: <T = object>(values: T) => (key: keyof T) => State<any>;
