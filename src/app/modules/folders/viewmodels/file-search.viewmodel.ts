export const ViewType = {
    list: 0,
    gird: 1,
};

export class FileSearchViewModel {
    id: string;
    name: string;
    createTime: Date;
    size: number;
    sizeString: string;
    creatorId: string;
    creatorFullName: string;
    creatorAvatar: string;
    folderId?: number;
    type: number;
    parentId?: number;
    idPath: string;
    url: string;
    absoluteUrl: string;
    childCount: number;
    folderName: string;
    isImage: boolean;
    isCheck: boolean;
    isEditName: boolean;
    isClick: boolean;
    extension: string;
    concurrencyStamp: string;
}
