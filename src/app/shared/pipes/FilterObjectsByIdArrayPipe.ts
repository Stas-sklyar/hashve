import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'filterObjectsByIdArray'})
export class FilterObjectsByIdArrayPipe implements PipeTransform {
  transform(items, ids: string[]): string {
    // console.log("FilterCategoryById working");
    /*if(!items || !ids || ids.length === 0){
      return items;
    }*/
    return items.filter(item => ids.indexOf(item._id) > -1);
  }
}
