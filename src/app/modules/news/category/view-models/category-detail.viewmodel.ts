import {CategoryTranslation} from '../models/category.model';

export interface CategoryDetailViewModel {
    id: string;
    bannerImage: string;
    isActive: boolean;
    isHomePage: boolean;
    concurrencyStamp: string;
    categoryTranslations: CategoryTranslation[];
}
