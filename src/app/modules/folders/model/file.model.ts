
export class Files {
    name: string;
    folderId: number;
    concurrencyStamp: string;

    constructor(name?: string, folderId?: number, concurrencyStamp?: string) {
        this.name = name ? name : '';
        this.folderId = folderId;
        this.concurrencyStamp = concurrencyStamp ? concurrencyStamp : '';
    }
}
