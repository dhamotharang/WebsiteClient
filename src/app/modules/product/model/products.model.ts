import {ProductTranslationViewModel} from './product-translation.viewmodel';

export class Products {
    productId: string;
    isHot: boolean;
    isHomePage: boolean;
    featureImage: string;
    salePrice: number;
    modelTranslations: ProductTranslationViewModel[];
    categories: number[];
    concurrencyStamp: string;
    constructor() {
        this.isHot = true;
        this.isHomePage = false;
        this.modelTranslations = [];
        this.categories = [];
    }
}
