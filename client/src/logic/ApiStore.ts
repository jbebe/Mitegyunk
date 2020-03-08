import EventEmitter from "eventemitter3";
import {IVote} from "../shared/Types";

export class ApiStore<T> {

    public static instance: Map<string, ApiStore<any>> = new Map<string, ApiStore<any>>();
    public static EVENT_READY: 'ready' = 'ready';

    private objects: T[] | null = null;
    private alreadyLoading: boolean = false;
    private waiting: EventEmitter<string> = new EventEmitter<string>();

    private constructor(private resourceName: string) {}

    public static getInstance<T>(resourceName: string): ApiStore<T> {
        if (!this.instance.has(resourceName)){
            console.log('creating instance of ' + resourceName);
            this.instance.set(resourceName, new ApiStore<T>(resourceName));
        }

        return this.instance.get(resourceName) as ApiStore<T>;
    }

    public async getAllAsync(): Promise<Array<T>> {
        // if objects is not filled, fetch from api
        if (this.objects === null){
            // fetch is already happening, wait for ready signal
            if (this.alreadyLoading){
                console.log('waiting for other thread to load ' + this.resourceName);
                await new Promise<void>((resolve, reject) => {
                    const rejectHandle = setTimeout(() => {
                        reject();
                    }, 5000);
                    this.waiting.once(ApiStore.EVENT_READY, (args) => {
                        clearTimeout(rejectHandle);
                        console.log('finally! resource is ready ' + this.resourceName);
                        resolve();
                    });
                });
            }
            else {
                this.alreadyLoading = true;
                console.log('fetching ' + this.resourceName);
                const response = await fetch(`http://localhost:4000/api/${this.resourceName}`);
                this.objects = await response.json();
                this.waiting.emit(ApiStore.EVENT_READY);
            }
        }
        return this.objects as T[];
    }

    public async createAsync(vote: IVote): Promise<void> {
        const response = await fetch(`http://localhost:4000/api/${this.resourceName}`, {
            method: 'POST',
            body: JSON.stringify(vote),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok){
            throw new Error(response.statusText);
        }
    }

}
