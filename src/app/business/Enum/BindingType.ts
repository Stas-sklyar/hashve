export enum BindingType{
    city = 'City',
    region = 'Region'
}

export namespace BindingType {
    export function values() {
        return Object.keys(BindingType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}