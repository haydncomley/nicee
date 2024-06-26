import { State } from "../nice";

export const nextId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
};

let parentId = nextId();

export const setParentId = (newParentId: string) => {
    parentId = newParentId;
};

export const getParentId = () => {
    return parentId;
}

export const serialiseDeps = (deps: State<any>[]) => {
    return deps.map((dep) => JSON.stringify(Object.hasOwn(dep, 'get') && dep.get())).join('');
}

export const camelToKebab = (camelCaseString: string) => {
    return camelCaseString.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
