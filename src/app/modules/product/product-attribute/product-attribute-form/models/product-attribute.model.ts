export class ProductAttributeTranslation {
    name: string;
    languageId: string;
    description: string;

    constructor() {

    }
}

export class ProductAttribute {
    isActive: boolean;
    isSelfContent: boolean;
    isMultiple: boolean;
    isRequire: boolean;
    concurrencyStamp: string;
    translations: ProductAttributeTranslation[];

    constructor() {
        this.isActive = true;
        this.isSelfContent = true;
        this.isMultiple = true;
        this.isRequire = true;
    }
}
