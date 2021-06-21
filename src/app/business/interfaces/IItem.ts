import {ITranslate} from './ITranslate';
import {ICategory} from './ICategory';
import {IRate} from './IRate';
import {Seo} from '../model/seo';

export interface IItem {
  _id?: string;
  name: ITranslate;
  code: string;
  picture: string;
  description: ITranslate;
  additional: boolean;
  rate: Array<IRate>;
  category: Array<string> | Array<ICategory>;
  dayDeal: boolean;
  inStock: boolean;
  recommended: boolean;
  price: number;
  show?: boolean;
  seo?: Seo;
}
