import {City} from '../city.model';
import {ITranslate} from '../../interfaces/ITranslate';

export class OfferResult {
  public id: string;
  public name: ITranslate;
  public pic: string;
  public city: City;
  public price: number;
  public deliveryPrice: number;

  constructor(item: OfferResult = null){
    if(item){
      this.id = item.id;
      this.name = item.name;
      this.city = item.city;
      this.pic = item.pic;
      this.price = item.price;
      this.deliveryPrice = item.deliveryPrice;
    }else{
      this.name = {en: '', heb: ''};
    }
  }
}
