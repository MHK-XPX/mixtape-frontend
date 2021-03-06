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
import { SongStart } from './non-local/songstart';

//Misc interfaces/enums
import { MessageType } from './misc/messagetype.enum';

//Messages:
import { GlobalPlaylistSong } from './messages/globalplaylistsong';
import { Message } from './messages/message';
import { VotedOn } from './messages/votedon';
import { Connection } from './messages/connection';

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
    SongStart,
    MessageType,
    GlobalPlaylistSong,
    Message,
    VotedOn,
    Connection
};