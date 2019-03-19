import {ProductCategoryTranslation} from './product-category-translation.model';
import {ProductCategoryAttribute} from '../product-category-attribute/product-category-attribute.model';

export class ProductCategory {
    id: number;
    parentId: number;
    idPath: string;
    isActive: boolean;
    order: number;
    concurrencyStamp: string;
    productCategoryAttributes: ProductCategoryAttribute[]
    translations: ProductCategoryTranslation[];

    constructor(id?: number, parentId?: number, idPath?: string, isActive?: boolean, order?: number,
                childCount?: number, concurrencyStamp?: string) {
        this.id = id ? id : -1;
        this.parentId = parentId;
        this.idPath = idPath;
        this.isActive = isActive !== undefined ? isActive : true;
        this.order = order ? order : 0;
        this.concurrencyStamp = concurrencyStamp;
        this.translations = [];
        this.productCategoryAttributes = [];
    }
}
