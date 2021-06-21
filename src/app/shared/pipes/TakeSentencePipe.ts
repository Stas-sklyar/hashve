import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'TakeSentence'})
export class TakeSentencePipe implements PipeTransform {
  transform(text: string, count: number): string {
    let tmp = text.split('.').map((item: string) => item.trim());
    tmp = tmp.slice(0, count);
    return tmp.join('. ');
  }
}
