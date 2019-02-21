export class Promotion {
    id: string;
    name: string;
    fromDate: string;
    toDate: string;
    isActive: boolean;
    createTime: string;
    creatorId: string;
    creatorFullName: string;
    description: string;
    seoLink: string;

    constructor() {
        this.isActive = true;
    }
}
