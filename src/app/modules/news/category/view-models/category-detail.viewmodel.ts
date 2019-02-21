import {CategoryTranslation} from '../models/category.model';

export interface CategoryDetailViewModel {
    id: string;
    isActive: boolean;
    concurrencyStamp: string;
    categoryTranslations: CategoryTranslation[];
}
