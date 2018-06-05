//Local DB interfaces
import { Album } from './api/album';
import { AlbumRating } from './api/albumrating';
import { Artist } from './api/artist';
import { Playlist } from './api/playlist';
import { PlaylistSong } from './api/playlistsong';
import { SearchResults } from './api/searchResults';
import { Song } from './api/song';
import { SongRating } from './api/songrating';
import { User } from './api/user';

//Non-Local DB fetched from other api's
import { LastfmTrack } from './non-local/lastfmtrack';
import { MessageOutput } from './non-local/messageoutput';
import { YoutubeResult } from './non-local/youtuberesult';

//Misc interfaces/enums
import { MessageType } from './misc/messagetype.enum';

export {
    Album,
    AlbumRating,
    Artist,
    Playlist,
    PlaylistSong,
    SearchResults,
    Song,
    SongRating,
    User,
    LastfmTrack,
    MessageOutput,
    YoutubeResult,
    MessageType
};