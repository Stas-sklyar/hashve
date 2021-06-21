export enum DeliveryType{
    delivery,
    pickup,
    fastDelivery
}

export namespace DeliveryType {
    export function values() {
        return Object.keys(DeliveryType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
