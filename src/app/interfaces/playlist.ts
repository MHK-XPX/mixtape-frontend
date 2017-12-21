import { PlaylistSong } from './playlistsong';

export interface Playlist{
    playlistId: number;
    active: boolean;
    name: string;
    userId: number;
    playlistSong: PlaylistSong[];
}