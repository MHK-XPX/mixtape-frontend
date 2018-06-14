/*
    This interface is used store the user's connection 
    id: The ID of the connection
    time: The time to start the song at
    first: If the user is the first one watching (controls the movement of the song)
*/
export interface Connection{
    id: string,
    time: number,
    first: boolean
}