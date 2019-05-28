export  class ProductCategory {
    id: number;
    name: string;
    description: string;
    createTime: string;
    creatorId: string;
    creatorFullName: string;
    isActive: boolean;
    parentId?: number;
    idPath: string;
    seoLink: string;
    image: string;
}
