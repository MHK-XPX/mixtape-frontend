import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'youtubePipe'
})
export class YoutubePipe implements PipeTransform {

  transform<T>(items: T[]): T[] {
    if(!items) return [];

    return items['items'];
  }

}
