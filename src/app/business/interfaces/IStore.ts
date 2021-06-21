import {ITranslate} from './ITranslate';
import {Location} from '../model/location.model';
import {WorkingHours} from '../model/working.hours.model';
import {IRate} from './IRate';
import {PaymentType} from '../Enum/PaymentType';
import {DeliveryType} from '../Enum/DeliveryType';
import {Delivery} from '../model/Delivery';
import {PackageStoreOffer} from '../model/package.store.offer';
import {ItemStoreOffer} from '../model/item.store.offer';
import {Seo} from '../model/seo';
import {City} from '../model/city.model';

export interface IStore {
    name: ITranslate;
    pic: Array<string> | string;
    address: ITranslate;
    city: City;
    tel: string;
    fax: string;
    mobile: string;
    mail: string;
    description: ITranslate;
    // что это такое
    adminActive: Boolean;
    active: Boolean;
    // ????
    message: string;
    adminMessage: string;
    payments: Array<PaymentType>;
    deliveryTypes: Array<DeliveryType>;
    items: Array<ItemStoreOffer>;
    delivery: Array<Delivery>;
    // deliveryPlaces: Array<Delivery>;
    packages: Array<PackageStoreOffer>;
    storeLocation: Location;
    rate: Array<IRate>;
    weekHours: WorkingHours;
    weekEndHours: WorkingHours;
    shabatHours: WorkingHours;
    seo?: Seo;
    reviewsCount?: number;
    rating: number;
}
