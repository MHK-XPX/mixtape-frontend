/*
    Written by: Ryan Kruse
    This service allows for us to easily save and get data from local ^ session storage
    It uses key value pairs to store and retrieve the data
*/

export class StorageService {
    constructor() { }

    /*
        This method is called whenever we want to set a value in session storage
        @param key: string - The key of the value
        @param value: any - The value for item
    */
    public setValue(key: string, value: any): void {
        if (value) {
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
    }

    /*
        This method is called whenever we attempt to get a value from session storage
        @param key: string - The key we want to get
        @return any - The value for the given key
    */
    public getValue(key: string): any {
        let value: string = sessionStorage.getItem(key);

        if (value && value !== "undefined" && value !== null) {
            return JSON.parse(value);
        }

        return null;
    }

    /*
        This method is called to check if we have a key in the session storage
        @param key: string - The key to check
        @return boolean - If they key is in session storage or not
    */
    public hasValue(key: string): boolean {
        if (sessionStorage.getItem(key) === null) {
            return false;
        }

        return true;
    }

    /*
        This method is called whenever we remove a value from session storage
        @param key: string - The key to remove from session storage
    */
    public removeValue(key: string): void {
        sessionStorage.removeItem(key);
    }

    /*
        This method is called whenever we want to clear all values from session storage
    */
    public clearAll(): void {
        sessionStorage.clear();
    }

    /*
        This method is called whenever we want to save a value to local storage
        @param key: string - The key to save
        @param value: any - The value for the key
    */
    public saveToLocal(key: string, value: any): void {
        if (value) {
            value = JSON.stringify(value);
        }

        localStorage.setItem(key, value);
    }

    /*
        This method is called whenever we attemp to get a value from local storage
        @param key: string - The key to get
        @return any - the value of the key
    */
    public getFromLocal(key: string): any {
        let value = localStorage.getItem(key);

        if (value && value !== "undefined" && value !== "null") {
            return JSON.parse(value);
        }

        return null;
    }

    /*
        This method is called when we want to remove a key from local storage
        @key: string - The key to remove
    */
    public removeFromLocal(key: string): void {
        localStorage.removeItem(key);
    }
}
