import {ProductCategoryTranslation} from './product-category-translation.model';

export  class ProductCategory {
    id: string;
    isActive: boolean;
    parentId?: number;
    concurrencyStamp: string;
    categoryTranslations: ProductCategoryTranslation[];
    order: number;
    bannerImage: string;
    constructor() {
        this.isActive = true;
        this.order = 1;
    }
}
