export enum ArticleType{
    homePage,
    shopInRegion,
    shopInCity,
    terms,
    faq,
    usingLow,
    contact,
    addNewStore,
}

export namespace ArticleType {
    export function values() {
        return Object.keys(ArticleType).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}