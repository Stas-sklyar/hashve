import {ITranslate} from '../interfaces/ITranslate';
import {ICity} from '../interfaces/ICity';

export class City implements ICity {
  _id?: string;
  name: ITranslate;
  description: ITranslate;
  pic: string;
  region: string;
  inPopular: boolean;
  inReview: boolean;
  minPrice: number;
  maxPrice: number;
  storeCount: string;
  country: string;
  itemCount: number;
  averagePrice: number;
  isPopular: boolean;
  seo: any;
  link: string;
  /**
   * Constructor
   *
   * @param item
   */
  constructor(item) {
    {
      this._id = item._id || '';
      this.name = item.name || {heb: '', en: ''};
      this.description = item.description || {heb: '', en: ''};
      this.pic = (item.pic === '' || item.pic === undefined) ? '/assets/city/no-photo-available.png' : '/assets/city/' + item.pic;
      this.country = item.country || '';
      this.region = item.region || '';
      this.inPopular = item.inPopular ? item.inPopular : false;
      this.inReview = item.inReview ? item.inReview : false;
      this.minPrice = item.minPrice ? item.minPrice : null;
      this.maxPrice = item.maxPrice ? item.maxPrice : null;
      this.storeCount = item.storeCount ? item.storeCount : null;
      this.itemCount = item.itemCount || 0;
      this.averagePrice = item.averagePrice || 0;
      this.isPopular = item.isPopular || false;
      if(item.seo === undefined || item.seo === null){
        this.seo = {}
      }else{
        this.seo = {
          title: item.seo.title || '',
          description: item.seo.description || '',
          keywords: item.seo.keywords || '',
          h1: item.seo.h1 || '',
        };
      }
      this.link = 'פרחים_' + item.name.heb.replace(/\s/, '_');
    }
  }


}
