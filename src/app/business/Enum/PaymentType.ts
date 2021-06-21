export enum PaymentType{
    phone,
    creditCard,
    error
    
     
}



export namespace PaymentType {
    export function values() {
        return Object.keys(PaymentType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
