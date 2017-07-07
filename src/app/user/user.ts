export interface User{
     /*
        API USER LAYOUT:
            public int UserId { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Password { get; set; }
            public string Username { get; set; }

    */
    UserId: number;
    FirstName: string;
    LastName: string;
    Password: string; //Dont actually keep this one here, I think
    Username: string;
}
