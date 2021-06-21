import {ITranslate} from '../interfaces/ITranslate';
import {ICategory} from '../interfaces/ICategory';
import {IItem} from '../interfaces/IItem';
import {Seo} from './seo';
import {environment} from '../../../environments/environment';


export class Category implements ICategory {
  _id: string;
  name: ITranslate;
  tagline: ITranslate;
  description: ITranslate;
  pic: string;
  count: number;
  subcategory: Array<string> | Array<Category>;
  renderOnHomePage: boolean;
  toTopMenu: boolean;
  toFooterMenu: boolean;
  avgPrice: number;
  items: Array<IItem> | Array<string>;
  seo: Seo;

  /**
   * Constructor
   *
   * @param category
   */
  constructor(item) {
    {
      this._id = item._id || '';
      this.name = item.name || {heb: '', en: ''};
      this.pic = (item.pic === '' || item.pic === undefined) ? '' : environment.apihost + '/assets/category/' + item.pic;
      this.tagline = item.tagline || {heb: '', en: ''};
      this.description = item.description || {heb: '', en: ''};
      this.count = item.count || 0;
      this.avgPrice = item.avgPrice || 0;
      this.items = item.items || [];
      this.seo = item.seo;
      this.renderOnHomePage = item.renderOnHomePage;
      this.toFooterMenu = item.toFooterMenu;
      this.subcategory = item.subcategory;
      this.toTopMenu = item.toTopMenu;
    }
  }
}
