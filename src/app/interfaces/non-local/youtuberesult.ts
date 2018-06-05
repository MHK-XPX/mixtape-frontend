export interface YoutubeResult{
    kind: string,
    etag: string,
    nextPageToken: string,
    prevPageToken: string,
    regionCode: string,
    pageInfo: {
        totalResults: number,
        resultsPerPage: number
    },
    items: items
}
export interface items{
    kind: string,
    etag: string,
    id: {
        kind: string,
        videoId: string,
        channelId: string,
        playlistId: string
    },
    snippet: snippet;
}

export interface snippet{
    publishedAt: string,
    channelId: string,
    title: string,
    description: string,
    thumbnails: {
    },
    channelTitle: string,
    liveBroadcastContent: string
}