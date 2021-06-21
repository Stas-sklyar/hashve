import {ITranslate} from './ITranslate';
import {IItem} from './IItem';
import {Seo} from '../model/seo';

export interface ICategory {
    _id?: string;
    name: ITranslate;
    tagline: ITranslate;
    renderOnHomePage: boolean;
    pic: string;
    count: number;
    avgPrice: number;
    items: Array<IItem> | Array<string>;
    seo: Seo;
}
