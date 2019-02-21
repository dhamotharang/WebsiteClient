import {ProductUnit} from './product-unit.model';
import {ProductConversionUnit} from './product-conversion-unit.model';

export class ProductListUnit {
    listUnit: ProductUnit[];
    listConversionUnit: ProductConversionUnit[];

    constructor(listUnit?: ProductUnit[], listConversionUnit?: ProductConversionUnit[]) {
        this.listUnit = listUnit ? listUnit : [];
        this.listConversionUnit = listConversionUnit ? listConversionUnit : [];
    }
}
