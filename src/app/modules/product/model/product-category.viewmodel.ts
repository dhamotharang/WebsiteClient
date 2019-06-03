import {ProductCategoryTranslation} from './product-category-translation.model';

export interface ProductCategoryViewModel {
    id: string;
    bannerImage: string;
    isActive: boolean;
    isHomePage: boolean;
    concurrencyStamp: string;
    categoryTranslations: ProductCategoryTranslation[];
}
