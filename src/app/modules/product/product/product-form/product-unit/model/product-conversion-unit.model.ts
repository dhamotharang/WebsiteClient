export class ProductConversionUnit {
    unitId: string;
    productUnitId: string;
    unitConversionId: string;
    productUnitConversionId: string;
    value: number;

    constructor(unitId?: string, unitConversionId?: string, value?: number) {
        this.unitId = unitId;
        this.unitConversionId = unitConversionId;
        this.value = value;
    }
}
