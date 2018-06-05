export interface SongRating{
    /*
    "songRatingId": 1,
        "comment": "Classic",
        "rating": 5,
        "songId": 5,
        "userId": 1,
        "song": null,
        "user": null
        */
    songRatingId: number;
    comment: string;
    rating: number;
    songId: number;
    userId: number;
    song?: any;
}