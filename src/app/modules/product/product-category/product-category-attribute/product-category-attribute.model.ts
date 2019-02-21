export class ProductCategoryAttribute {
    categoryId: number;
    attributeId: string;

    constructor(categoryId?: number, attributeId?: string) {
        this.categoryId = categoryId ? categoryId : -1;
        this.attributeId = attributeId;
    }
}
