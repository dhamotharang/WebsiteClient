export class Comment {
    id: number;
    objectId: string; // Sản phẩm, bài viết, nhóm sản phẩm, nhóm bài viết
    objectType: number; // 0: Sản phẩm,1: bài viết, 2:nhóm sản phẩm, 3:nhóm bài viết
    fullName: string;
    email: string;
    avatar: string;
    content: string;
    createTime: Date;
    parentId: number;
    idPath: string;
    userId: string;
    userType: number;
    isShow: boolean;
    url: string;
}
