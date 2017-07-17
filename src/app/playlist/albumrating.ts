export interface AlbumRating{
    /*
    "albumRatingId": 1,
        "albumId": 3,
        "comment": "My favorite GNR album",
        "rating": 5,
        "userId": 1,
        "album": null,
        "user": null
        */
    albumRatingId: number;
    albumId: number;
    comment: string;
    rating: number;
    userId: number;
    album?: any;
}