export enum StatusType{
    NewOrder,
    Payed,
    Closed,
    Canceled,
    NA
}

export namespace StatusType {
    export function values() {
        return Object.keys(StatusType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}