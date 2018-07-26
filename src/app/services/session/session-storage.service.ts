/*
    Written by: Ryan Kruse
    This service allows for us to easily save and get data from local ^ session storage
    It uses key value pairs to store and retrieve the data
*/

export class StorageService {
  constructor() { }

  /**
   * Called whenever we want to set a value in session storage
   * 
   * @param {string} key The key for the value 
   * @param {any} value The value of the item
   */
  public setValue(key: string, value: any): void {
    if (value) {
      value = JSON.stringify(value);
    }
    sessionStorage.setItem(key, value);
  }

  /**
   * Called whenever we attemp to get a values from session storage
   * 
   * @param {string} key The key we want to get
   * 
   * @returns The value for the given key 
   */
  public getValue(key: string): any {
    let value: string = sessionStorage.getItem(key);

    if (value && value !== "undefined" && value !== null) {
      return JSON.parse(value);
    }

    return null;
  }

  /**
   * Called to check if we have a key in session storage
   * 
   * @param {string} key The key to check
   * 
   * @returns If the key is in session storage or not 
   */
  public hasValue(key: string): boolean {
    if (sessionStorage.getItem(key) === null) {
      return false;
    }

    return true;
  }

  /**
   * Called whenever we remove a value from session storage
   * 
   * @param {string} key The key to remomve from session storage 
   */
  public removeValue(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Called whenever we want to clear all values from session storage
   */
  public clearAll(): void {
    sessionStorage.clear();
  }

  /**
   * Called whenever we want to save a value to local storage
   * 
   * @param {string} key The key to save 
   * @param {any} value The value for the key 
   */
  public saveToLocal(key: string, value: any): void {
    if (value) {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  }

  /**
   * Called whenever we attempt to get a value from local storage
   * 
   * @param {string} key
   * 
   * @returns The value of the key 
   */
  public getFromLocal(key: string): any {
    let value = localStorage.getItem(key);

    if (value && value !== "undefined" && value !== "null") {
      return JSON.parse(value);
    }

    return null;
  }

  /**
   * Called whenever we want to remove a key from local storage
   * 
   * @param {string} key The key to be removed 
   */
  public removeFromLocal(key: string): void {
    localStorage.removeItem(key);
  }
}
