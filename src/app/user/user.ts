export interface User{
     /*
        API USER LAYOUT:
            public int UserId { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Password { get; set; }
            public string Username { get; set; }

    */
    userId: number;
    firstName: string;
    lastName: string;
    password: string; //Dont actually keep this one here, I think
    username: string;
    albumRating;
    playlist;
    songRating;
}
/*


    "userId": 1,
    "firstName": "Joseph",
    "lastName": "Shaw",
    "password": "not yet encrypted",
    "username": "jshaw",
    "albumRating": [],
    "playlist": [],
    "songRating": []

*/