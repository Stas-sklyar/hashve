import {ITranslate} from './ITranslate';

export interface ICity {
  _id?: string;
  name: ITranslate;
  description: ITranslate;
  pic: string;
  inPopular: boolean;
  inReview: boolean;
  minPrice: number;
  maxPrice: number;
  storeCount: string;
  region: string;
  country: string;
  itemCount: number;
  averagePrice: number;
  link: string;
  seo: any;
}
