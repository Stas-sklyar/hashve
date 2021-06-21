import {Pipe, PipeTransform} from "@angular/core";


@Pipe({name: "spaceToUnderscore"})
export class SpaceToUnderscorePipe implements PipeTransform {
  transform(value: string): string {
    value = value.replace(/\s/g, "_")
    return value;
  }
}
