import { ITranslate } from "./../../interfaces/ITranslate";

export class CitySearchStorage {
  _id: string;
  name: ITranslate;

  public constructor(item: CitySearchStorage) {
    this._id = item._id;
    this.name = item.name;
  }
}
