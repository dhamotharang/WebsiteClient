import {AttributeValueViewModel} from '../../../../product-attribute/product-attribute-value/product-attribute-value.viewmodel';

export class ProductAttribute {
    id?: string;
    attributeId: string;
    attributeName: string;
    value: string;
    attributeValues: AttributeValueViewModel[];
    attributeValueId?: string;
    attributeValueName?: string;
    isMultiple: boolean;
    isSelfContent: boolean;
    isShowClient?: boolean;
    languageId?: string;
    isRequired?: boolean;

    constructor(attributeId?: string,
                value?: string,
                attributeValues?: AttributeValueViewModel[],
                isShowClient?: boolean, isRequired?: boolean) {
        this.attributeId = attributeId;
        this.value = value;
        this.attributeValues = attributeValues;
        this.isShowClient = isShowClient;
        this.isRequired = isRequired;
    }
}
