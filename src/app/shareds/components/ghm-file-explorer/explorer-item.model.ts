export class ExplorerItem {
    id: string | number;
    name: string;
    type: string;
    createTime: string;
    size: number;
    sizeString: string;
    creatorId: string;
    creatorFullName: string;
    creatorAvatar: string;
    extension?: string;
    icon: string;
    folderId?: number;
    isSelected: boolean;
    isImage: boolean;
    absoluteUrl: string;
    url: string;

    constructor(id?: string | number, name?: string, type?: string, createTime?: string, size?: number, creatorId?: string,
                creatorFullName?: string, creatorAvatar?: string, extension?: string, url?: string, absoluteUrl?: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.sizeString = this.bytesToSize(size);
        this.createTime = createTime;
        this.creatorId = creatorId;
        this.creatorFullName = creatorFullName;
        this.creatorAvatar = creatorAvatar;
        this.extension = extension;
        this.isSelected = false;
        this.url = url;
        this.absoluteUrl = absoluteUrl;
        this.isImage = this.checkIsImage(extension);
    }

    bytesToSize(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);
        if (i === 0) {
            return `${bytes} ${sizes[i]})`;
        }
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
    }

    checkIsImage(extension: string) {
        return ['png', 'jpg', 'jpeg', 'gif'].indexOf(extension) > -1;
    }
}
