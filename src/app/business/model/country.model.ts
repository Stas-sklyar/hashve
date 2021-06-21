import {ITranslate} from '../interfaces/ITranslate';

export class Country {
    _id: string;
    name: ITranslate;
    regions: Array<string>; // | Array<IRegion>;
    /**
     * Constructor
     *
     * @param item
     */
    constructor(item) {
        {
            this._id = item._id || '';
            this.name = item.name || {heb: '', en: ''};
            this.regions = item.regions;
        }
    }
}
