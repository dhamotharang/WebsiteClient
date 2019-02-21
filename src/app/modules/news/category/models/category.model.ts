export class Category {
    isActive: boolean;
    parentId?: number;
    isHomePage: boolean;
    concurrencyStamp: string;
    categoryTranslations: CategoryTranslation[];
    order: number;

    constructor() {
        this.isActive = true;
        this.isHomePage = false;
        this.order = 1;
    }
}

export class CategoryTranslation {
    languageId: string;
    name: string;
    metaTitle: string;
    description: string;
    metaDescription: string;
    seoLink: string;
}
