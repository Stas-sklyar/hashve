import {ITranslate} from './ITranslate';
import { IItem } from './IItem';
import { ItemSize } from '../Enum/ItemSize';

export interface IPackage {
    _id?: string;
    name: ITranslate;
    color: string;
    baseItem: IItem | string;
    size: ItemSize;
    addItems: Array<IItem> | Array<string>;
    price: number;
}
