export class CommentViewModel {
    id?: number;
    parentId?: number;
    idPath: string;
    fullName: string;
    email: string;
    avatar: string;
    sendTime: Date;
    content: string;
    childCount?: number;
}
