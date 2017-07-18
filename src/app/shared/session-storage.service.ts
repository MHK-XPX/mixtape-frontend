export class StorageService{
    constructor(){}

    public setValue(key: string, value: any): void{
        if(value){
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
    }

    public hasValue(key: string): boolean{
        if(sessionStorage.getItem(key) === null){
            return false;
        }
        return true;
    }

    public getValue(key: string): any{
        let value: string = sessionStorage.getItem(key);

        if(value && value != "undefined" && value != "null"){
            return JSON.parse(value);
        }

        return null;
    }

    public removeValue(key: string): void{
        sessionStorage.removeItem(key);
    }

    public clearAll(): void{
        sessionStorage.clear();
    }
}