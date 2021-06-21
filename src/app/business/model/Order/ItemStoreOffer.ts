import { IItem } from '../../interfaces/IItem';
export class ItemStoreOffer {
  public item: IItem | string;
  public price: number;
  public inStock: boolean;
  public discount: number;
}
