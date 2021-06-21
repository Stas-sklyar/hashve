import {ITranslate} from './ITranslate';

export interface ICountry {
    _id: string;
    name: ITranslate;
    regions: Array<string>; // | Array<IRegion>;
}