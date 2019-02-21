export interface FileViewModel {
    id: string;
    name: string;
    createTime: string;
    lastUpdate: string;
    type: string;
    size: number;
    url: string;
    creatorId: string;
    creatorFullName: string;
    creatorAvatar: string;
    extension: string;
    folderId?: number;
    concurrencyStamp: string;
}
