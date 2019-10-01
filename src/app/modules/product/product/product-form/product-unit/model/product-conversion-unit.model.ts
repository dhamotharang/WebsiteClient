export class ProductConversionUnit {
    unitId: string;
    unitName: string;
    productUnitId: string;
    conversionUnitId: string;
    conversionUnitName: string;
    value: number;
    salePrice: number;

    constructor(unitId?: string, unitName?: string, conversionUnitId?: string, conversionUnitName?: string, value?: number) {
        this.unitId = unitId;
        this.unitName = unitName;
        this.conversionUnitId = conversionUnitId;
        this.conversionUnitName = conversionUnitName;
        this.value = value;
    }
}
