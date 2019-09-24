import {ProductTranslation} from './product-translation.model';
import {ProductImage} from './product-image.model';
import {ProductListUnit} from '../product-form/product-unit/model/product-list-unit.model';
import {ProductConversionUnit} from '../product-form/product-unit/model/product-conversion-unit.model';
import {ProductAttribute} from '../product-form/product-attribute/model/product-value.model';

export class Product {
    id: string;
    isActive: boolean;
    isManagementByLot: boolean;
    thumbnail: string;
    concurrencyStamp: string;
    unitId: string;
    unitName: string;
    categories?: number[];
    images: ProductImage[];
    translations: ProductTranslation[];
    productListUnit: ProductListUnit;
    conversionUnits: ProductConversionUnit[];
    attributes: ProductAttribute[];
    salePrice?: number;
    isChangeAttribute?: boolean;
    isChangeConversionUnit?: boolean;
    isHomePage?: boolean;
    isHot?: boolean;

    constructor() {
        this.id = '';
        this.isActive = true;
        this.isManagementByLot = true;
        this.images = [];
        this.translations = [];
        this.categories = [];
        this.thumbnail = '';
        this.productListUnit = null;
        this.conversionUnits = [];
        this.attributes = [];
        this.isChangeAttribute = false;
        this.isChangeConversionUnit = false;
        this.salePrice = null;
        this.unitId = null;
        this.unitName = null;
        this.isHomePage = false;
        this.isHot = false;
    }
}
