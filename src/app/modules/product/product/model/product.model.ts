import {ProductTranslation} from './product-translation.model';
import {ProductImage} from './product-image.model';
import {ProductListUnit} from '../product-form/product-unit/model/product-list-unit.model';

export class Product {
    isActive: boolean;
    isManagementByLot: boolean;
    thumbnail: string;
    isHot: boolean;
    isHomePage: boolean;
    concurrencyStamp: string;
    categories: number[];
    images: ProductImage[];
    translations: ProductTranslation[];
    productListUnit: ProductListUnit;

    constructor() {
        this.isHot = true;
        this.isHomePage = false;
        this.isActive = true;
        this.isManagementByLot = true;
        this.images = [];
        this.translations = [];
        this.categories = [];
        this.thumbnail = '';
        this.productListUnit = null;
    }
}
