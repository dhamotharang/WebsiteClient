export class ProductValue {
    id: string;
    productAttributeId: string;
    productAttributeName: string;
    value: string;
    productAttributeValueId: string;
    productAttributeValueName: string;
    productAttributeIsMultiple: boolean;
    productAttributeIsSelfContent: boolean;
    isShowClient: boolean;
    languageId: string;

    constructor(productAttributeId?: string,
                value?: string,
                productAttributeValueId?: string,
                isShowClient?: boolean) {
        this.productAttributeId = productAttributeId;
        this.value = value;
        this.productAttributeValueId = productAttributeValueId;
        this.isShowClient = isShowClient;
    }
}
