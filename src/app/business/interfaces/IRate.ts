import {Item} from '../model/item.model';

export interface IRate {
  _id?: string;
  fullName: string;
  createdAt?: Date;
  rate: number;
  feedback: string;
  approved: boolean;
  item: string | Item;
}
