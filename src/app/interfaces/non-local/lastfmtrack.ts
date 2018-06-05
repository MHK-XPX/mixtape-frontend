export interface LastfmTrack {
    track: {
        name: string,
        mbid: string,
        url: string,
        duration: string,
        streamable: string[],
        listeners: string,
        playcount: string,
        artist: {
            name: string,
            mbid: string,
            url: string
        },
        album: {
            artist: string,
            title: string,
            mbid: string,
            url: string,
            images: string[]
        }
    }
}