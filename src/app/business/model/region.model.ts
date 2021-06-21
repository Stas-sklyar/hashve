import {ITranslate} from '../interfaces/ITranslate';

export class Region {
    _id: string;
    name: ITranslate;
    country: any;
    cityes: Array<any>;
    pic: string;
    itemCount: number;
    averagePrice: number;

    /**
     * Constructor
     *
     * @param item
     */
    constructor(item) {
        {
            this._id = item._id || '';
            this.name = item.name || {en: '', heb: ''};
            this.country = item.country || '';
            this.cityes = item.cityes || [];
            this.pic = (item.pic === '' || item.pic === undefined) ? '' : item.pic;
            this.itemCount = item.itemCount || '';
            this.averagePrice = item.averagePrice || '';
        }
    }
}
