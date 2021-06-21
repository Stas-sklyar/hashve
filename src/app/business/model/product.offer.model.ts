import {IProductOffer} from '../interfaces/IProductOffer';
import {ICity} from '../interfaces/ICity';
import {IPackage} from '../interfaces/IPackage';
import {IStore} from '../interfaces/IStore';
import {City} from './city.model';
import {Package} from './package.model';
import {Store} from './store.model';
import {DiscountType} from '../Enum/DiscountType';

export class ProductOffer implements IProductOffer {
  _id?: string;
  city: City;
  finished: boolean;
  store: Store;
  package: Package;
  orderNumber: number;
  discountType: DiscountType;
  /**
   * Constructor
   *
   * @param item
   */
  constructor(item: IProductOffer) {
    {
      this._id = item._id || '';
      this.city = item.city ? new City(item.city) : null;
      this.finished = item.finished;
      this.package = item.package ? new Package(item.package) : null;
      this.store = item.store ? new Store(item.store) : null;
      this.orderNumber = item.orderNumber;
      this.discountType = item.discountType;
    }
  }


}
