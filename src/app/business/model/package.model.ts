import {ITranslate} from '../interfaces/ITranslate';
import {IPackage} from '../interfaces/IPackage';
import {IItem} from '../interfaces/IItem';
import {ItemSize} from '../Enum/ItemSize';
import {Item} from './item.model';
import {Store} from './store.model';
import {City} from './city.model';

export class Package implements IPackage {
  _id?: string;
  name: ITranslate;
  color: string;
  baseItem: Item;
  size: ItemSize;
  addItems: Array<Item> | string[];
  tmp: boolean;
  price: number;

  /**
   * Constructor
   *
   * @param pack
   */
  constructor(pack?: any) {
    {
      this._id = pack._id || '';
      this.name = pack.name || {heb: '', en: ''};
      this.color = pack.color || '#fff';
      this.baseItem = pack.baseItem ? new Item(pack.baseItem) : null;
      this.size = pack.size ? pack.size : ItemSize.normal;
      this.addItems = pack.addItems || [];
      this.price = pack.price || 0;
      this.tmp = pack.tmp || true;
    }
  }

  public stringifyPackage(addItems: IItem[], store: Store, city: City): string {
    let addItemsText: string = '';
    addItems.forEach(item => {
      if((this.addItems as string[]).indexOf(item._id) > -1){
        addItemsText += item.name.heb + " מק''ט " + item.code + ' + ';
      }
    });
    const text = `הזמנה$: ${this.baseItem.name.heb} מק"ט ${this.baseItem.code}
         + ${addItemsText} מחיר כולל משלוח ב${city.name.heb}. 
         סה"כ לתשלום: ${store.getPackagePrice(this) as number + (store.getDeliveryPrice(city._id) as number)}`;
    return text;
  }
}
