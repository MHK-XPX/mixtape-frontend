/*
    What is stored:
        _user - The user that is currently logged in
        _users - A list of all the users (this will probably be removed)
        _playlists - A list of all the users playlists
        _songMap - A list of all the playlist the user owns containing the song details, <key, value> = <playlistId, Song[]>
        loggedIn - If the user is currently logged in or not
*/
export class StorageService{
    constructor(){}

    /*
        Sets a key in session storage to a given key
        @param key: string = the key of the object
        @param value: any - the value we want to set the key to
    */
    public setValue(key: string, value: any): void{
        if(value){
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
    }

    /*
        Returns a value from session storage if it exists, returns null if it does not
        @param key: string - the object we want to get the value for
        @return any - Returns the value of the key or null if the key is not in storage
    */
    public getValue(key: string): any{
        let value: string = sessionStorage.getItem(key);

        if(value && value != "undefined" && value != "null"){
            return JSON.parse(value);
        }

        return null;
    }

    /*
        Returns if the key is in the session storage or not
    */
    public hasValue(key: string): boolean{
        if(sessionStorage.getItem(key) === null){
            return false;
        }
        return true;
    }

    /*
        Removes the key and its corresponding value from session storage
    */
    public removeValue(key: string): void{
        sessionStorage.removeItem(key);
    }

    /*
        Clears the whole storage
    */
    public clearAll(): void{
        sessionStorage.clear();
    }
}