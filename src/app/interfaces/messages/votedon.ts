export interface VotedOn{
    /**
     * The ID of the global playlist song that we have(n't) voted on
     */
    globalPlaylistSongId: number;
    /**
     * If we have voted on the given globalPlaylistSongId song
     */
    voted: boolean;
}