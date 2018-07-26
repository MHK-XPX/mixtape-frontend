import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'youtubePipe'
})
export class YoutubePipe implements PipeTransform {

    /**
     * Used when we get youtube songs from the youtube API.
     * @param {T} items The youtube results 
     * 
     * @returns The youtube results stripped down a level
     */
    transform<T>(items: T[]): T[] {
        if (!items) return [];

        return items['items'];
    }
}