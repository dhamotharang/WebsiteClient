import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductUnit} from './model/product-unit.model';
import {ProductConversionUnit} from './model/product-conversion-unit.model';
import * as _ from 'lodash';
import {ProductListUnit} from './model/product-list-unit.model';
import {ToastrService} from 'ngx-toastr';
import {UnitService} from '../../../unit/service/unit.service';
import {ProductService} from '../../service/product.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NumberValidator} from '../../../../../validators/number.validator';
import {BaseFormComponent} from '../../../../../base-form.component';
import {NhSuggestion} from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {UtilService} from '../../../../../shareds/services/util.service';
import {SearchResultViewModel} from '../../../../../shareds/view-models/search-result.viewmodel';

@Component({
    selector: 'app-product-form-product-unit',
    templateUrl: './product-unit.component.html',
    providers: [NumberValidator]
})

export class ProductUnitComponent extends BaseFormComponent {
    @Input() listProductUnit: ProductUnit[] = [];
    @Input() listProductUnitConversion: ProductConversionUnit[] = [];
    @Input() productId;
    @Input() isReadonly = false;
    @Output() selectProductListUnit = new EventEmitter();
    listUnitSuggestion: NhSuggestion[] = [];
    listUnitSelect: NhSuggestion[] = [];
    productUnitId;
    formGroup: FormGroup;
    oldSalePrice;
    oldValue;

    constructor(private unitService: UnitService,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private numberValidator: NumberValidator,
                private utilService: UtilService,
                private productService: ProductService) {
        super();
    }

    addUnit() {
        this.listProductUnit.push(new ProductUnit(false, '', 0));
    }

    removeUnit(productUnit: ProductUnit, index) {
        _.pullAt(this.listProductUnit, [index]);
        this.getProductUnitSelect();
    }

    selectIsDefault(item: ProductUnit) {
        item.isDefault = !item.isDefault;
        if (item.isDefault) {
            const listProductUnitNotDefault = _.filter(this.listProductUnit, (unit: ProductUnit) => {
                return unit.unitId !== item.unitId;
            });

            if (listProductUnitNotDefault && listProductUnitNotDefault.length > 0) {
                _.each(listProductUnitNotDefault, (unitNotDefault: ProductUnit) => {
                    unitNotDefault.isDefault = false;
                });
            }
        }
    }

    addUnitConversion() {
        this.listProductUnitConversion.push(new ProductConversionUnit('', '', 0));
    }

    removeUnitConversion(unitConversion: ProductConversionUnit, index) {
        _.pullAt(this.listProductUnitConversion, [index]);
    }

    renderListUnit() {
        if (this.listProductUnit && this.listProductUnit.length > 0) {
            this.productUnitId = this.listProductUnit[0].id;
        }

        if (!this.listUnitSuggestion || this.listUnitSuggestion.length === 0) {
            this.unitService.suggestions('', 1, 1000).subscribe((result: SearchResultViewModel<NhSuggestion>) => {
                this.listUnitSuggestion = result.items;
                this.getProductUnitSelect();
            });
        }
    }

    selectProductUnit(value: NhSuggestion, item: ProductUnit, index) {
        if (value) {
            const countProductById = _.countBy(this.listProductUnit, (productUnit: ProductUnit) => {
                return productUnit.unitId === value.id;
            }).true;

            if (countProductById && countProductById > 0 && value.id !== item.unitId) {
                this.toastr.error('Unit already exists');
                _.pullAt(this.listProductUnit, [index]);
                this.listProductUnit.push(new ProductUnit(item.isDefault, '', item.salePrice));
                return;
            } else {
                item.unitId = value.id.toString();
                this.utilService.focusElement('unit ' + value.id);
                this.getProductUnitSelect();
            }
        } else {
            item.unitId = '';
        }
    }

    selectUnit(unitConversion: ProductConversionUnit, value: NhSuggestion, index) {
        if (value) {
            if (unitConversion.unitId === value.id) {
                this.toastr.error(`Unit must other UnitConversion`);
                _.pullAt(this.listProductUnitConversion, [index]);
                this.listProductUnitConversion.push(new ProductConversionUnit('', unitConversion.unitConversionId,
                    unitConversion.value));
                return;
            } else {
                const countProductByUnitId = _.countBy(this.listProductUnitConversion, (productUnitConversion: ProductConversionUnit) => {
                    return (productUnitConversion.unitId === value.id
                        && productUnitConversion.unitConversionId === unitConversion.unitConversionId)
                        || (productUnitConversion.unitId === unitConversion.unitConversionId
                            && productUnitConversion.unitConversionId === value.id);
                }).true;

                if (countProductByUnitId && countProductByUnitId > 0 && unitConversion.unitId !== value.id) {
                    this.toastr.error('Unit already exists');
                    _.pullAt(this.listProductUnitConversion, [index]);
                    this.listProductUnitConversion.push(new ProductConversionUnit('', unitConversion.unitConversionId,
                        unitConversion.value));
                    return;
                } else {
                    unitConversion.unitId = value.id.toString();
                }
            }
        } else {
            unitConversion.unitId = '';
        }
    }

    selectUnitConversionId(unitConversion: ProductConversionUnit, value: NhSuggestion, index) {
        if (value) {

            if (unitConversion.unitId === value.id) {
                this.toastr.error(`UnitConversion must other Unit`);
                _.pullAt(this.listProductUnitConversion, [index]);
                this.listProductUnitConversion.push(new ProductConversionUnit(unitConversion.unitId, '',
                    unitConversion.value));
                return;
            } else {
                const countProductByUnitConversion = _.countBy(this.listProductUnitConversion,
                    (productUnitConversion: ProductConversionUnit) => {
                        return (productUnitConversion.unitConversionId === value.id
                            && productUnitConversion.unitId === unitConversion.unitId) ||
                            (productUnitConversion.unitConversionId === unitConversion.unitId
                                && productUnitConversion.unitId === value.id);
                    }).true;
                if (countProductByUnitConversion && countProductByUnitConversion > 0 && unitConversion.unitConversionId !== value.id) {
                    this.toastr.error('Unit already exists');
                    _.pullAt(this.listProductUnitConversion, [index]);
                    this.listProductUnitConversion.push(new ProductConversionUnit(unitConversion.unitId, '',
                        unitConversion.value));
                    return;
                } else {
                    unitConversion.unitConversionId = value.id.toString();
                }
            }
        } else {
            unitConversion.unitConversionId = '';
        }
    }

    save() {
        const isExistsUnitNotSelect = _.find(this.listProductUnit, (unit: ProductUnit) => {
            return !unit.unitId;
        });

        if (isExistsUnitNotSelect) {
            this.toastr.error('Please select product unit');
            return;
        }

        this.listProductUnit = _.filter(this.listProductUnit, (productUnit: ProductUnit) => {
            return productUnit.unitId;
        });
        this.listProductUnitConversion = _.filter(this.listProductUnitConversion, (productUnitConversion: ProductConversionUnit) => {
            return productUnitConversion.unitId && productUnitConversion.unitConversionId;
        });

        const existsDefault = _.find(this.listProductUnit, (unit: ProductUnit) => {
            return unit.isDefault;
        });

        if (!existsDefault) {
            this.toastr.error('Please select set isDefault');
            return;
        }

        const productListUnit = new ProductListUnit(this.listProductUnit, this.listProductUnitConversion);
        if (this.productId) {
            if (this.productUnitId) {
                this.productService.updateUnit(this.productId, this.productUnitId, productListUnit).subscribe(() => {
                    this.getProductUnit();
                });
            } else {
                this.productService.insertUnit(this.productId, productListUnit)
                    .subscribe(() => {
                        this.getProductUnit();
                    });
            }
        } else {
            this.selectProductListUnit.emit(productListUnit);
        }
    }

    getProductUnit() {
        this.productService.getProductUnit(this.productId).subscribe((result: SearchResultViewModel<ProductUnit>) => {
            this.listProductUnit = result.items;
            if (this.listProductUnit && this.listProductUnit.length > 0) {
                this.productUnitId = this.listProductUnit[0].id;
            } else {
                this.productUnitId = '';
            }
        });
    }

    changeProductUnitConversionValue(productConversionUnit: ProductConversionUnit) {
        if (!Number(productConversionUnit.value) || Number(productConversionUnit.value) < 0) {
            this.toastr.error('Value is valid');
            productConversionUnit.value = this.oldValue;
            this.utilService.focusElement(`value - ${productConversionUnit.unitId} - ${productConversionUnit.unitConversionId}`)
            return;
        }
    }

    changeSalePrice(productUnit: ProductUnit) {
        if (!Number(productUnit.salePrice) || Number(productUnit.salePrice) < 0) {
            this.toastr.error('Sale Price is valid');
            productUnit.salePrice = this.oldSalePrice;
            this.utilService.focusElement(`salePrice - ${productUnit.unitId}`)
            return;
        }
    }

    private emitProductListUnit() {
        const productListUnit = new ProductListUnit(this.listProductUnit, this.listProductUnitConversion);
        this.selectProductListUnit.emit(productListUnit);
    }

    private getProductUnitSelect() {
        const joinUnitSelectId = _.join(_.map(this.listProductUnit, (unit: ProductUnit) => {
            return unit.unitId;
        }), ',');

        this.listUnitSelect = _.filter(this.listUnitSuggestion, (unitSuggestion: NhSuggestion) => {
            return joinUnitSelectId.indexOf(unitSuggestion.id) > -1;
        });
    }
}
