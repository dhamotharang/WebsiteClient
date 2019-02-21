export class FolderSearchViewModel {
    id: number;
    name: string;
    idPath: string;
    parentId?: number;
    childCount: number;
    isCheck?: boolean;
    createTime: Date;
    creatorFullName: string;
    creatorAvatar: string;
    isFolder: boolean;
    isEditName: boolean;
    concurrencyStamp: string;

    constructor(id?: number, name?: string, parentId?: number,
                isFolder?: boolean, isEditName?: boolean, concurrencyStamp?: string) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.isFolder = true;
    }
}
