export interface AlbumRating{
    albumRatingId: number;
    albumId: number;
    comment: string;
    rating: number;
    userId: number;
    album?: any;
}