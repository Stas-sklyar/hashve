import {ITranslate} from './ITranslate';
import {ArticleType} from '../Enum/ArticleType';
import {ICity} from './ICity';
import {IRegion} from './IRegion';
import {Seo} from '../model/seo';
import {BindingType} from '../Enum/BindingType';

export interface IArticle {
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
}
