import { NhSuggestion } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';

export interface GoodsReceiptNoteBarcodeViewModel {
    id: string;
    productId: string;
    name: string;
    price: string;
    unitId: string;
    unitName: string;
    quantity: number;

    units: NhSuggestion[];
}
