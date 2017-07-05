import { Song } from './song';

export class PlayList{
    //The name of our playlist
    name: string = "New Playlist";
    //All of the songs in the playlist
    songs: Song[] = [];

    /*
        This method is called when we add a song to our playlist
        @param url: string - The url we want to add to our playlist
    */
    public addYouTubeLink(url: string): void{
        if(url !== ''){
            let _song: Song = new Song(url);
            this.songs.push(_song);
        }
    }

    /*
        This method is called when we delete a song from our playlist
        @param index: number - the index of the song we want to delete
    */
    public deleteYouTubeLink(index: number): void{
        this.songs.splice(index,1);
    }

    /*
        This method is called when we want to get the next song...shouldn't be called anymore
        TODO: Prepare for removal!
    */
    public getNextYouTubeLink(): any{
        let _song: Song = this.songs.shift();
        return _song.URL;
    }

    /*
        This method is called when we want to load our urls into our playlist
        @return any[] - A list of urls from our playlist
    */
    public getAllYouTubeLinks(): any[]{
        let urls: any[] = []
        for(let song of this.songs){
            urls.push(song.URL);
        }
        return urls;
    }

    //Used when the playlist is init. created
    public setDefaultName(index: number): void{
        this.name += " " + index;
    }

    //Used when the user wants to change the name
    public setName(name: string): void{
        this.name = name;
    }
}