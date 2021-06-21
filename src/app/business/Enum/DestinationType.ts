export enum DestinationType {
    private = 'private',
    office = 'office'
}

export namespace DestinationType {
    export function values() {
        return Object.keys(DestinationType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
