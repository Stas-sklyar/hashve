export enum ItemSize {
    normal = 0,
    large = 40,
    extralarge = 80
}

export namespace ItemSize {
    export function values() {
        return Object.keys(ItemSize).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
