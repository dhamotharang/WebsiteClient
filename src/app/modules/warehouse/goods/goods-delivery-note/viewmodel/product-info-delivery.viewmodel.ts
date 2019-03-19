import {NhSuggestion} from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';

export class ProductInfoDeliveryViewModel {
    productId: string;
    productName: string;
    unitDefaultId: string;
    unitDefaultName: string;
    priceRetail: number;
    exWarehousePrice: number;
    calculatorMethod: number;
    units: NhSuggestion[];
}
