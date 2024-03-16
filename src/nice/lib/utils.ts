let parentId = 'R';
let id = 0;

export const nextId = () => {
    return `${parentId}.${id++}`;
};

export const setParentId = (newParentId: string) => {
    parentId = newParentId;
};

export const getParentId = () => {
    return parentId;
}