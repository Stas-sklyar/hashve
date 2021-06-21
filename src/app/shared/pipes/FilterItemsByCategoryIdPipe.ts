import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'filterItemsByCategoryId'})
export class FilterItemsByCategoryIdPipe implements PipeTransform {
  transform(items, categoryId: string): string {
    // console.log("FilterCategoryById working");
    if(!items || !categoryId){
      return items;
    }
    return items.filter(item => item.category.indexOf(categoryId) > -1);
  }
}
