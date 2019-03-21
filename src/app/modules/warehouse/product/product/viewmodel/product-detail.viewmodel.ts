import { ProductImage } from '../model/product-image.model';
import { ProductTranslation } from '../model/product-translation.model';
import { ProductCategoryViewModel } from './product-category.viewmodel';
import { ProductUnit } from '../product-form/product-unit/model/product-unit.model';
import { ProductConversionUnit } from '../product-form/product-unit/model/product-conversion-unit.model';
import { ProductAttribute } from '../product-form/product-attribute/model/product-value.model';

export class ProductDetailViewModel {
    id: string;
    isActive: boolean;
    isManagementByLot: boolean;
    thumbnail: string;
    concurrencyStamp: string;
    unitId: string;
    unitName: string;
    salePrice: number;
    likeCount?: number;
    commentCount?: number;
    viewCount?: number;
    source: string;
    status: number;
    sentTime?: Date;
    approvedTime?: Date;
    approverUserId: string;
    approverFullName: string;
    approverAvartar: string;
    approverComment: string;
    isHot?: boolean;
    isHomePage?: boolean;
    lastUpdateHot?: Date;
    lastUpdateHomePage?: Date;
    categories: ProductCategoryViewModel[];
    units: ProductUnit[];
    conversionUnits: ProductConversionUnit[];
    images: ProductImage[];
    attributes: ProductAttribute[];
    translations: ProductTranslation[];
}
