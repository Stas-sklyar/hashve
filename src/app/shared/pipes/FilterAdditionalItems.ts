import { Pipe, PipeTransform } from '@angular/core';
import { IItem } from '../../business/interfaces/IItem';

@Pipe({
  name: 'FilterAdditionalItems'
})
export class FilterAdditionalItemsPipe implements PipeTransform {

  constructor() { }
  transform(items: IItem[]) {
    return items.filter(item => !item.additional);
  }

}
