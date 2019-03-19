import {ProductCategoryTranslation} from '../model/product-category-translation.model';
import {ProductCategoryAttributeViewModel} from '../product-category-attribute/product-category-attribute.viewmodel';

export class ProductCategoryDetailViewModel {
    id: number;
    name: string;
    description: string;
    parentId: number;
    isActive: boolean;
    order: number;
    concurrencyStamp: string;
    translations: ProductCategoryTranslation[];
    productCategoryAttributes: ProductCategoryAttributeViewModel[];
}
