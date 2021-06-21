import {IItem} from '../interfaces/IItem';

export class ItemStoreOffer {
    public item: IItem | String;
    public price: number;
    public inStock: boolean;
    public discount: number; // скидка магазина после улучшения цены
}
