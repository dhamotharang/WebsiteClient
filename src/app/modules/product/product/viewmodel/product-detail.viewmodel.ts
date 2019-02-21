import {ProductImage} from '../model/product-image.model';
import {ProductTranslation} from '../model/product-translation.model';
import {ProductCategoryViewModel} from './product-category.viewmodel';
import {ProductUnit} from '../product-form/product-unit/model/product-unit.model';
import {ProductConversionUnit} from '../product-form/product-unit/model/product-conversion-unit.model';
import {ProductValue} from '../product-form/product-attribute/model/product-value.model';

export class ProductDetailViewModel {
    id: string;
    isActive: boolean;
    isManagementByLot: boolean;
    thumbnail: string;
    isHot: boolean;
    isHomePage: boolean;
    concurrencyStamp: string;
    categories: ProductCategoryViewModel[];
    units: ProductUnit[];
    conversionUnits: ProductConversionUnit[];
    images: ProductImage[];
    values: ProductValue[];
    translations: ProductTranslation[];
}
