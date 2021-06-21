import {ITranslate} from '../interfaces/ITranslate';
import {ICity} from '../interfaces/ICity';
import {ArticleType} from '../Enum/ArticleType';
import {BindingType} from '../Enum/BindingType';
import {IRegion} from '../interfaces/IRegion';
import {Seo} from './seo';
import {IArticle} from '../interfaces/IArticle';

export class Article implements IArticle {
  _id?: string;
  header: ITranslate;
  slogan: ITranslate;
  shitFromLeft: ITranslate;
  text: ITranslate;
  pic: String;
  showInList: boolean;
  articleType: ArticleType;
  binding: {
    bindingType: BindingType,
    object: String | ICity | IRegion;
  };
  seo: Seo;

  /**
   * Constructor
   *
   * @param item
   */
  constructor(item) {
    {
      this._id = item._id || '';
      this.header = item.header || {heb: '', en: ''};
      this.slogan = item.slogan || {heb: '', en: ''};
      this.shitFromLeft = item.shitFromLeft || {heb: '', en: ''};
      this.text = item.text || {heb: '', en: ''};
      this.pic = (item.pic === '' || item.pic === undefined) ? 'assets/avatar/profile.jpg' : item.pic;
      this.showInList = item.showInList || false;
      this.articleType = item.articleType || 0;
      this.binding = item.binding || {};
      this.seo = item.seo;
    }
  }
}
