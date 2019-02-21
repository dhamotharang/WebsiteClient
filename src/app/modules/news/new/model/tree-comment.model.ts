export class TreeComment {
    id?: number;
    parentId?: number;
    idPath: string;
    fullName: string;
    email: string;
    avatar: string;
    sendTime: Date;
    content: string;
    childCount?: number;
    children?: TreeComment[];

    constructor(id?: number,
                parentId?: number,
                idPath?: string,
                fullName?: string,
                email?: string,
                avatar?: string,
                sendTime?: Date,
                content?: string,
                childCount?: number,
                children?: TreeComment[]) {
        this.id = id;
        this.parentId = parentId;
        this.idPath = idPath;
        this.fullName = fullName;
        this.email = email;
        this.avatar = avatar;
        this.sendTime = sendTime;
        this.content = content;
        this.childCount = childCount;
        this.children = children;
    }
}
