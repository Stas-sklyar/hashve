import { IStore } from "../interfaces/IStore";
import { ITranslate } from "../interfaces/ITranslate";
import { PaymentType } from "../Enum/PaymentType";
import { DeliveryType } from "../Enum/DeliveryType";
import { ItemStoreOffer } from "./item.store.offer";
import { Delivery } from "./Delivery";
import { PackageStoreOffer } from "./package.store.offer";
import { Location } from "./location.model";
import { IRate } from "../interfaces/IRate";
import { WorkingHours, StoreTime } from "./working.hours.model";
import { Seo } from "./seo";
import { Package } from "./package.model";
import * as _ from "lodash";
import { ItemSize } from "../Enum/ItemSize";
import { Item } from "./item.model";
import { environment } from "../../../environments/environment";
import { City } from "./city.model";

export class Store implements IStore {
  name: ITranslate;
  pic: Array<string> | string;
  address: ITranslate;
  city: City;
  tel: string;
  fax: string;
  mobile: string;
  mail: string;
  description: ITranslate;
  adminActive: Boolean;
  active: Boolean;
  callToStore: boolean;
  callNumber: boolean;
  message: string;
  adminMessage: string;
  storeLocation: Location;
  payments: Array<PaymentType>;
  deliveryTypes: Array<DeliveryType>;
  //form added for now
  items: Array<ItemStoreOffer>;
  delivery: Array<Delivery>;
  // deliveryPlaces: Array<Delivery>;
  packages: Array<PackageStoreOffer>;
  rate: Array<IRate>;
  // added to form
  weekHours: WorkingHours;
  weekEndHours: WorkingHours;
  shabatHours: WorkingHours;
  seo?: Seo;
  reviewsCount?: number;
  rating: number;
  link: string;
  url: string;
  ind: number;
  isOpen: boolean = false;
  color?: string;
  isHover: boolean = true;
  _id?: string;

  /**
   * Constructor
   *
   * @param item
   */
  constructor(item) {
    {
      this.name = item.name || { en: "", heb: "" };

      if (item.pic && typeof item.pic === "string") {
        this.pic =
          item.pic === "" || item.pic === undefined
            ? ""
            : environment.apihost + "/assets/store/" + item.pic || [];
      } else if (item.pic && item.pic.length > 0) {
        this.pic =
          item.pic.map((img: string) =>
            img === "" || img === undefined
              ? ""
              : environment.apihost + "/assets/store/" + img
          ) || [];
      }
      this.address = item.address || { en: "", heb: "" };
      this.city = item.city;
      this.seo = item.seo ? item.seo : {};
      this.link = item.link;
      this.ind = item.ind;
      this.url = `${this.ind}-${this.name.heb.replace(/\s/g, "-")}`;
      this.tel = item.tel || "";
      this.fax = item.fax || "";
      this.mobile = item.mobile || "";
      this.mail = item.mail || "";
      this.description = item.description || { en: "", heb: "" };
      // что это такое
      this.adminActive = item.adminActive || false;
      this.active = item.active || false;
      this.callToStore = item.callToStore || false;
      this.callNumber = item.callNumber || false;
      // ????
      this.message = item.message || "";
      this.adminMessage = item.adminMessage || "";
      this.payments = item.payments ? item.payments.map((item) => +item) : [];
      this.deliveryTypes = item.deliveryTypes || [];
      this.items = item.items || [];
      this.delivery = item.delivery || [];
      // deliveryPlaces: Array<Delivery>;
      this.packages = item.packages || [];
      this.storeLocation = item.storeLocation || new Location();
      this.rate = item.rate || [];

      // const timeOffset = (new Date()).getTimezoneOffset();

      this.weekHours =
        item.weekHours ||
        new WorkingHours(false, new StoreTime(8, 0), new StoreTime(18, 0));
      this.weekEndHours =
        item.weekEndHours ||
        new WorkingHours(false, new StoreTime(8, 0), new StoreTime(18, 0));
      this.shabatHours =
        item.shabatHours ||
        new WorkingHours(false, new StoreTime(8, 0), new StoreTime(18, 0));
      this.reviewsCount = item.reviewsCount;
      this.rating = item.rating;
      this._id = item._id || "";
      this.isOpen = this.checkIsOpen();
      this.color = item.color || "";
    }
  }

  getLocalTime() {
    const israelOffset = -2;
    let currentLocalTime = new Date();
    let offset = currentLocalTime.getTimezoneOffset() / 60;
    let inIsrael = currentLocalTime.setHours(
      currentLocalTime.getHours() - (offset - israelOffset)
    );
    // ;
    //
    // today.setHours(today.getHours() - offset);
    // let realOffset = offset - israelOffset;
    // offset
  }

  getPriceById(_id) {
    let itemOffer;
    if (this.items[0].item instanceof Object) {
      itemOffer = this.items.find((item) => (item.item as Item)._id === _id);
    } else {
      itemOffer = this.items.find((item) => item.item === _id);
    }

    return itemOffer && itemOffer.price ? itemOffer.price : false;
  }

  getPriceOfPackWithoutDiscount(pkg): number {
    if (pkg.tmp === false) {
      return pkg.price;
    }
    let price: number = 0;
    price = this.getPriceById(pkg.baseItem._id) + (pkg.size as number);
    if (pkg.addItems[0] instanceof Object) {
      pkg.addItems.forEach((item) => {
        price += this.getPriceById(item._id);
      });
    } else {
      pkg.addItems.forEach((item) => {
        price += this.getPriceById(item);
      });
    }

    return price;
  }

  getPriceOfPackWithoutDiscountWithDelivery(pkg, cityId): number {
    return (
      this.getPriceOfPackWithoutDiscount(pkg) + this.getDeliveryPrice(cityId)
    );
  }

  getPrice(product: Item): number {
    product = new Item(product);
    if (product.isDayDeal() || product.isSale()) {
      return product.price;
    }
    let itemOffer;
    if (this.items[0].item instanceof Object) {
      itemOffer = this.items.find(
        (item) => (item.item as Item)._id === product._id
      );
    } else {
      itemOffer = this.items.find((item) => item.item === product._id);
    }
    if (product.improvePriceRequest) {
      let delta = Math.abs(Date.now() - product.improvePrice.getTime()) / 1000;
      if (delta < environment.priceImproveTime * 60) {
        return (itemOffer.price - itemOffer.discount) as number;
      } else {
        return itemOffer.price as number;
      }
    } else {
      return itemOffer.price as number;
    }
  }

  getDeliveryPrice(cityID): number {
    let deliveryObj = this.delivery.find((val) => val.city === cityID);
    return deliveryObj ? deliveryObj.price : null;
  }

  getPackagePrice(pkg: Package): number {
    if (pkg.tmp === false) {
      return pkg.price;
    }
    let price: number = 0;
    price = this.getPrice(pkg.baseItem) + (pkg.size as number);
    if (pkg.addItems[0] instanceof Object) {
      pkg.addItems.forEach((item) => {
        price += this.getPrice(item);
      });
    } else {
      pkg.addItems.forEach((item) => {
        price += this.getPriceById(item);
      });
    }

    return price;
  }

  getPackagePriceWithDelivery(pkg, delivery): number {
    return this.getPackagePrice(pkg) + this.getDeliveryPrice(delivery);
  }

  checkIsOpen() {
    let israelOffset = -120;
    let now = new Date();
    let offset = now.getTimezoneOffset() - israelOffset;
    let field = "";
    now = new Date(now.setMinutes(now.getMinutes() + offset));
    switch (now.getDay()) {
      case 6:
        field = "shabatHours";
        if (!this.shabatHours.active) {
          return false;
        }
        break;
      case 5:
        field = "weekEndHours";
        if (!this.weekEndHours.active) {
          return false;
        }
        break;
      default:
        if (!this.weekHours.active) {
          return false;
        }
        field = "weekHours";
    }

    let openTime = this[field].open.hour * 60 + this[field].open.minute;

    let closeTime = this[field].close.hour * 60 + this[field].close.minute;

    let nowTime = now.getHours() * 60 + now.getMinutes();

    return nowTime > openTime && nowTime < closeTime ? true : false;
  }

  inStock(item: string): boolean {
    return this.items.find((itm) => itm.item === item).inStock;
  }
}
