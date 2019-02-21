export class Folder {
    id: number;
    name: string;
    parentId: number;
    concurrencyStamp: string;
    creatorId: string;
    creatorFullName; string;
    creatorAvatar: string;
    createTime: string;

    constructor(name?: string, parentId?: number,
                concurrencyStamp?: string) {
        this.name = name ? name : '';
        this.parentId = parentId;
        this.concurrencyStamp = concurrencyStamp ? concurrencyStamp : '';
    }
}
