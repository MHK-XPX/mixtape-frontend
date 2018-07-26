/*
    This interface is used store the user's connection 
    id: The ID of the connection
    time: The time to start the song at
    first: If the user is the first one watching (controls the movement of the song)
*/
export interface Connection{
    /**
     * The ID of the connection (given by the signalR hub) - unique
     */
    id: string,
    /**
     * The time to start the song at
     */
    time: number,
    /**
     * If the user is the first one watching the global playlist
     * (Is first in the Queue on the signalR hub)
     */
    first: boolean
}