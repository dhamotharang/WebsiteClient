import {NewsTranslation} from './news-translations.model';

export const NewsStatus = {
    draft: 0, // Nháp
    pending: 1, // Đang chờ
    approved: 2, // Đang duyệt
    decline: 3 // Hủy duyệt
};

export class Tag {
    tagId: string;
    name: string;
}

export class News {
    id: string;
    concurrencyStamp: string;
    featureImage: string;
    bannerImage: string;
    altImage: string;
    source: string;
    isHot: boolean;
    isHomePage: boolean;
    isActive: boolean;
    categoriesNews: number[];
    modelTranslations: NewsTranslation[];

    constructor() {
        this.isHot = true;
        this.isHomePage = false;
        this.isActive = true;
        this.modelTranslations = [];
        this.categoriesNews = [];
    }
}
