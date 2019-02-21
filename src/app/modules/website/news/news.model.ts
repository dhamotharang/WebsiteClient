export class News {
    id: number;
    title: string;
    description: string;
    content: string;
    createTime: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    isActive: boolean;
    creatorId: string;
    creatorFullName: string;
    creatorImage: string;
    image: string;
    isHot?: boolean;
    isHomePage?: boolean;
    lastUpdate?: string;
    source?: string;
    categoryIds: number[];

    constructor(id?: number, title?: string, description?: string, content?: string, createTime?: string, viewCount?: number,
        likeCount?: number, commentCount?: number, isActive?: boolean, creatorId?: string, creatorFullName?: string,
        creatorImage?: string, image?: string, isHot?: boolean, isHomePage?: boolean, lastUpdate?: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.createTime = createTime;
        this.viewCount = viewCount;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.isActive = isActive ? isActive : false;
        this.creatorId = creatorId;
        this.creatorFullName = creatorFullName;
        this.creatorImage = creatorImage;
        this.image = image;
        this.isHot = isHot;
        this.isHomePage = isHomePage;
        this.lastUpdate = lastUpdate;
    }
}
