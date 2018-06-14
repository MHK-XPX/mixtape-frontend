/*
    This interface is used to send songs from the local or global playlist to our youtube component. It is only
    used to change the song
    url: string - The url of the song
    time: number - The time to start the song at
*/
export interface SongStart{
    url: string,
    time: number
}