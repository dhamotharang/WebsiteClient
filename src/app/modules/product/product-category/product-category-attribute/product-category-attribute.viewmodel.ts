export class ProductCategoryAttributeViewModel {
    categoryId: number;
    attributeId: string;
    attributeName: string;

    constructor(categoryId?: number, attributeId?: string, attributeName?: string) {
        this.categoryId = categoryId ? categoryId : -1;
        this.attributeId = attributeId;
        this.attributeName = attributeName;
    }
}
