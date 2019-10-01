import {ProductTranslationViewModel} from './product-translation.viewmodel';
import {ProductCategoriesViewModel} from './product-categories.viewmodel';

export class ProductDetail {
    productId: string;
    isHot: boolean;
    isHomePage: boolean;
    featureImage: string;
    salePrice: number;
    translations: ProductTranslationViewModel[];
    categories: ProductCategoriesViewModel[];
    concurrencyStamp: string;
    constructor() {
        this.isHot = true;
        this.isHomePage = false;
        this.translations = [];
        this.categories = [];
}
}
