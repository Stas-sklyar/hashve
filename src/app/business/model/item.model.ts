import { ITranslate } from "../interfaces/ITranslate";
import { ICategory } from "../interfaces/ICategory";
import { IItem } from "../interfaces/IItem";
import { IRate } from "../interfaces/IRate";
import * as _ from "lodash";
import { Seo } from "./seo";
import { environment } from "../../../environments/environment";

export class Item implements IItem {
  _id: string;
  name: ITranslate;
  description: ITranslate;
  code: string;
  picture: string;
  additional: boolean;
  rate: Array<IRate>;
  category: Array<string> | Array<ICategory>;
  dayDeal: boolean;
  recommended: boolean;
  inStock: boolean;
  price: number;
  improvePrice: Date;
  improvePriceRequest: boolean;
  rating?: number;
  reviewsCount?: number;
  saledCount?: number;
  show?: boolean;
  minPrice?: number;
  maxPrice?: number;
  seo?: Seo;

  /**
   * Constructor
   *
   * @param item
   */
  constructor(item) {
    {
      this._id = item._id || "";
      this.name = item.name || { heb: "", en: "" };
      this.description = item.description || { heb: "", en: "" };
      this.code = item.code || "";
      this.picture =
        item.picture === "" || item.picture === undefined ? "" : item.picture;
      this.additional =
        item.additional === undefined || item.additional === null
          ? true
          : item.additional;
      this.rate = item.rate || [];
      this.category = item.category || "";
      this.dayDeal =
        item.dayDeal === undefined || item.dayDeal === null
          ? false
          : item.dayDeal;
      this.recommended =
        item.recommended === undefined || item.recommended === null
          ? false
          : item.recommended;
      this.inStock =
        item.inStock === undefined || item.inStock === null
          ? false
          : item.inStock;
      this.price = item.price || 0;
      this.improvePriceRequest = item.improvePriceRequest || false;
      this.improvePrice = item.improvePrice || null;
      this.show = false;
      this.reviewsCount = item.reviewsCount;
      this.saledCount = item.saledCount;
      this.rating = item.rating;
      this.maxPrice = item.maxPrice;
      this.minPrice = item.minPrice;
      this.seo = item.seo;
    }
  }

  isDayDeal(): boolean {
    return this.dayDeal;
  }

  isSale(): boolean {
    return this.dayDeal === false && this.price > 0;
  }

  isPriceImproveValid(): boolean {
    return (
      this.improvePriceRequest &&
      (Date.now() - this.improvePrice.getTime()) / (1000 * 60) <
        environment.priceImproveTime
    );
  }

  getMinutes(): number {
    const endTime =
      this.improvePrice.getTime() + environment.priceImproveTime * 60 * 1000;
    return Math.floor((endTime - Date.now()) / (1000 * 60));
  }

  getSeconds(): number {
    const endTime =
      this.improvePrice.getTime() + environment.priceImproveTime * 60 * 1000;
    return Math.floor(((endTime - Date.now()) / 1000) % 60);
  }
}
