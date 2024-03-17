import { NiceComponent } from "./lib/nice-component";
import { NiceState } from "./lib/nice-state";

export type NiceNode = NiceComponent<any> | NiceState<any>;

export * from './lib/nice-app'
export * from './lib/nice-component'
export * from './lib/nice-renderer'
export * from './lib/nice-state'
export * from './lib/nice-utils'
export * from './lib/nice-store'