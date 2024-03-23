import { NiceState } from "../nice";
export declare const nextId: () => string;
export declare const setParentId: (newParentId: string) => void;
export declare const getParentId: () => string;
export declare const serialiseDeps: (deps: NiceState<any>[]) => string;
export declare const camelToKebab: (camelCaseString: string) => string;
