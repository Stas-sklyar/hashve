import {City} from '../model/city.model';
import {Package} from '../model/package.model';
import {Store} from '../model/store.model';
import {DiscountType} from '../Enum/DiscountType';

export interface IProductOffer {
  _id?: string;
  store: Store;
  city: City;
  package: Package;
  finished: boolean;
  orderNumber: number;
  discountType?: DiscountType;
}
