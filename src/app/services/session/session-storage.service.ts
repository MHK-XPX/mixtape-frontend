import { Observable } from 'rxjs';

export class StorageService {
    constructor() {

    }

    public setValue(key: string, value: any): void{
        if(value){
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
    }

    public getValue(key: string): any{
        let value: string = sessionStorage.getItem(key);

        if(value && value !== "undefined" && value !==  null){
            return JSON.parse(value);
        }

        return null;
    }

    public hasValue(key: string): boolean{
        if(sessionStorage.getItem(key) === null){
            return false;
        }

        return true;
    }

    public removeValue(key: string): void{
        sessionStorage.removeItem(key);
    }

    public clearAll(): void{
        sessionStorage.clear();
    }

    public saveToLocal(key: string, value: any): void{
        if(value){
            value = JSON.stringify(value);
        }

        localStorage.setItem(key, value);
    }

    public getFromLocal(key: string): any{
        let value = localStorage.getItem(key);

        if(value && value !== "undefined" && value !== "null"){
            return JSON.parse(value);
        }

        return null;
    }

    public removeFromLocal(key: string): void{
        localStorage.removeItem(key);
    }
}
