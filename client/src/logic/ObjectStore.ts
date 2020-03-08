import {IPreference, IVote} from "../shared/Types";

export class Votes {
    public static votes: IVote = {
        name: '',
        restaurants: [] as IPreference[],
    }
}

/*export class ObjectStore<T> {

    public static instance: ObjectStore<any> = new ObjectStore<any>();

    private object: T | null = null;

    public static getInstance<T>(initialValue: T): ObjectStore<T> {
        if (!this.instance){
            console.log('creating object store instance');
            this.instance = new ObjectStore<T>();
            this.instance.set(initialValue);
        }

        return this.instance as ObjectStore<T>;
    }

    public get(): T | null {
        return this.object;
    }

    public set(obj: T | null): T | null {
        return this.object = obj;
    }

}*/
