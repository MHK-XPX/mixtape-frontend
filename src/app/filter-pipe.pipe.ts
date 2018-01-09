import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe'
})
export class FilterPipe implements PipeTransform {

  transform<T>(items: T[], searchText: string): T[] {
    if(!items) return [];
    if(!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(it =>{
      return it['name'].toLowerCase().includes(searchText);
    });
  }

}
