// import {ITranslate} from './interfaces/ITranslate';
import {IRate} from '../interfaces/IRate';
import {Item} from './item.model';
import { Order } from './Order/Order';
import { City } from './city.model';

export class Rate implements IRate {
  _id?: string;
  fullName: string;
  createdAt?: Date;
  rate: number;
  feedback: string;
  approved: boolean;
  item: string | Item;
  city: string | City;
  order: string | Order;

  /**
   * Constructor
   *
   * @param rate
   */
  constructor(rate: Rate = null) {
    {
      if (rate && rate._id) {
        this._id = rate._id || '';
      }
      this.fullName = rate ? rate.fullName : '';
      if (rate && rate.createdAt)
        this.createdAt = rate.createdAt;
      this.rate = rate ? rate.rate : 0;
      this.feedback = rate ? rate.feedback : '';
      this.approved = rate ? rate.approved : false;
      this.item = rate ? rate.item : '';
      this.city = rate ? rate.city : '';
      this.order = rate ? rate.order : '';
    }
  }
}
