import { Pipe, PipeTransform } from '@angular/core';

import { Artist } from './interfaces/artist';
import { Album } from './interfaces/album';
import { Song } from './interfaces/song';

@Pipe({
  name: 'editPipe'
})
export class EditPipe implements PipeTransform {

  transform<T>(items: T[], artist: Artist, album: Album): T[] {
    if(!items) return [];
    if(!artist && !album) return items;

    let filterId: number;
    if(artist && !album){
      filterId = artist.artistId;

      return items.filter(it =>{
        return it['artistId'] == artist.artistId;
      });
    }

    filterId = album.albumId;
    return items.filter(it => {
      return it['albumId'] == filterId;
    })
  }

}
