export class ProductImage {
    productId: string;
    description: string;
    url: string;
    isThumbnail: boolean;

    constructor(productId?: string, description?: string, url?: string) {
        this.productId = productId;
        this.description = description;
        this.url = url;
    }
}
