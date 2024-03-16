let parentId = 'R';

export const nextId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
};

export const setParentId = (newParentId: string) => {
    parentId = newParentId;
};

export const getParentId = () => {
    return parentId;
}