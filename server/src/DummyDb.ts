import jsonfile from 'jsonfile';

export class DummyDb<T> {

    private readonly dbFilePath: string;

    constructor(path: string) {
        path = `db/${path}.db.json`;
        this.dbFilePath = path;

        (async () => {
            try {
                const obj = await jsonfile.readFile(path);
                if (obj.prototype.constructor.name !== Array.name)
                    throw new Error();
            }
            catch (ex){
                await jsonfile.writeFile(path, []);
            }
        })();
    }

    protected openDbAsync(): Promise<any> {
        return jsonfile.readFile(this.dbFilePath);
    }

    protected saveDbAsync(db: any): Promise<any> {
        return jsonfile.writeFile(this.dbFilePath, db);
    }

    public async getAsync(selector: (obj: T) => boolean): Promise<any> {
        const db = await this.openDbAsync() as T[];
        const obj = db.find((o) => selector(o));
        return obj || null;
    }

    public async getAllAsync(): Promise<T[]> {
        const db = await this.openDbAsync();

        return db as T[];
    }

    public async addAsync(obj: T): Promise<void> {
        const db = await this.openDbAsync() as T[];

        db.push(obj);

        await this.saveDbAsync(db);
    }

    public async updateAsync(selector: (obj: T) => boolean, newObj: T): Promise<void> {
        const db = await this.openDbAsync() as T[];
        const idx = db.findIndex((o) => selector(o));
        if (idx >= 0){
            db[idx] = newObj;
        }
        else {
            throw new Error('User not found');
        }
    }

    public async deleteAsync(selector: (obj: T) => boolean): Promise<void> {
        const db = await this.openDbAsync() as T[];
        const idx = db.findIndex((o) => selector(o));

        if (idx >= 0){
            db.splice(idx, 1);
        }
        else {
            throw new Error('User not found');
        }
    }
}
