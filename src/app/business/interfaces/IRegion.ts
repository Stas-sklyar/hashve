import {ITranslate} from './ITranslate';

export interface IRegion {
    _id: string;
    name: ITranslate;
    country: any;
    cityes: Array<any>;
    pic: string;
    itemCount: number;
    averagePrice: number;
}