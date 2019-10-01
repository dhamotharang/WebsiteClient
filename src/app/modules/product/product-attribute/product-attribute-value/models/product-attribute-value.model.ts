export class ProductAttributeValueTranslation {
    languageId: string;
    name: string;
    description: string;
}

export class ProductAttributeValue {
    isActive: boolean;
    concurrencyStamp: string;
    translations: ProductAttributeValueTranslation[];

    constructor() {
        this.isActive = true;
    }
}
