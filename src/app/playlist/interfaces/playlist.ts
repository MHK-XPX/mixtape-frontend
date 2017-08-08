import { PlaylistSong } from './playlistsong';

export interface PlayList{
    playlistId: number;
    active: boolean;
    name: string;
    userId: number;
    playlistSong: PlaylistSong[];
}