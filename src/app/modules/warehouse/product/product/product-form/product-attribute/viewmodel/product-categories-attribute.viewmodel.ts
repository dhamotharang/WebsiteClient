import {NhSuggestion} from '../../../../../../../shareds/components/nh-suggestion/nh-suggestion.component';

export class ProductCategoriesAttributeViewModel {
    categoryId: number;
    attributeId: string;
    attributeName: string;
    isSelfContent: boolean;
    isMultiple: boolean;
    value: string;
    productAttributeValueSuggestion: NhSuggestion[];

    constructor() {
        this.productAttributeValueSuggestion = [];
    }
}
