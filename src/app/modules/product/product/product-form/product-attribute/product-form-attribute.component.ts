import {Component, Inject, Input, OnInit} from '@angular/core';
import {ProductService} from '../../service/product.service';
import {ProductAttributeService} from '../../../product-attribute/product-attribute.service';
import {ProductCategoriesAttributeViewModel} from './viewmodel/product-categories-attribute.viewmodel';
import {ProductValue} from './model/product-value.model';
import * as _ from 'lodash';
import {ToastrService} from 'ngx-toastr';
import {BaseFormComponent} from '../../../../../base-form.component';
import {NhSuggestion} from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';
import {SearchResultViewModel} from '../../../../../shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-product-form-attribute',
    styleUrls: ['../../product.scss'],
    templateUrl: './product-form-attribute.component.html'
})
export class ProductFormAttributeComponent extends BaseFormComponent implements OnInit {
    @Input() productId: string;
    @Input() listProductValue: ProductValue[];
    @Input() isUpdate;
    @Input() isReadOnly = false;
    listAttribute: ProductCategoriesAttributeViewModel[] = [];
    productCategoryAttributeValueSuggestions: NhSuggestion[] = [];
    productAttributeSuggestions: NhSuggestion[] = [];
    urlProductAttributeSuggestion;
    productAttributeSelect;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private productService: ProductService,
                private toastr: ToastrService,
                private productAttributeService: ProductAttributeService) {
        super();
        this.urlProductAttributeSuggestion = `${appConfig.API_GATEWAY_URL}api/v1/products/product-attributes/suggestion`;
    }

    ngOnInit() {
    }

    getProductAttribute() {
        if (!this.listProductValue || this.listProductValue.length === 0) {
            this.productService.getProductAttribute(this.productId)
                .subscribe((result: SearchResultViewModel<ProductCategoriesAttributeViewModel>) => {
                    this.listAttribute = result.items;
                });
        }
        this.rendResult();
    }

    onSelectedProductAttributeValue(attributeId: string, attributeName: string, isMultiple: boolean, values: any) {
        if (values) {
            if (this.isUpdate) {
                if (isMultiple) {
                    _.each(values, (valueSuggestion: NhSuggestion) => {
                        const existsProductValue = _.find(this.listProductValue, (productValue: ProductValue) => {
                            return productValue.productAttributeId === attributeId
                                && productValue.productAttributeValueId === valueSuggestion.id;
                        });

                        if (!existsProductValue) {
                            const productValueInsert = new ProductValue();
                            productValueInsert.productAttributeValueId = valueSuggestion.id.toString();
                            productValueInsert.productAttributeId = attributeId;
                            productValueInsert.productAttributeValueName = valueSuggestion.name;
                            productValueInsert.languageId = this.currentLanguage;
                            productValueInsert.productAttributeIsMultiple = isMultiple;
                            productValueInsert.productAttributeIsSelfContent = false;
                            productValueInsert.productAttributeName = attributeName;

                            this.productService.insertAttributeValue(this.productId, productValueInsert)
                                .subscribe((result: ActionResultViewModel) => {
                                    productValueInsert.id = result.data;
                                    this.listProductValue.push(productValueInsert);
                                });
                        }
                    });
                } else {
                    const productValues = _.filter(this.listProductValue, (productValue: ProductValue) => {
                        return productValue.productAttributeId === attributeId;
                    });

                    if (!productValues || productValues.length === 0) {
                        const productValueInsert = new ProductValue();
                        productValueInsert.productAttributeValueId = values.id.toString();
                        productValueInsert.productAttributeId = attributeId;
                        productValueInsert.productAttributeValueName = values.name;
                        productValueInsert.languageId = this.currentLanguage;
                        productValueInsert.productAttributeIsMultiple = isMultiple;
                        productValueInsert.productAttributeIsSelfContent = false;
                        productValueInsert.productAttributeName = attributeName;

                        this.productService.insertAttributeValue(this.productId, productValueInsert)
                            .subscribe((result: ActionResultViewModel) => {
                                productValueInsert.id = result.data;
                                this.listProductValue.push(productValueInsert);
                            });
                    } else {
                        const productValue = productValues[0];
                        productValue.productAttributeId = attributeId;
                        productValue.productAttributeValueId = values.id;
                        productValue.productAttributeValueName = values.name;
                        productValue.languageId = this.currentLanguage;

                        this.productService.updateProductAttributeValue(this.productId, productValue.id, productValue)
                            .subscribe(() => {
                                // this.listProductValue.push(productValueInsert);
                            });
                    }
                }
                const productAttribute = this.getProductAttributeById(attributeId);
                if (productAttribute) {
                    productAttribute.productAttributeValueSuggestion = values;
                }
            } else {
                _.remove(this.listProductValue, (value: ProductValue) => {
                    return value.productAttributeValueId === attributeId;
                });
                if (isMultiple) {
                    _.each(values, (value: NhSuggestion) => {
                        const existsProductValue = _.find(this.listProductValue, (productValue: ProductValue) => {
                            return productValue.productAttributeId === attributeId
                                && productValue.productAttributeValueId === value.id;
                        });

                        if (!existsProductValue) {
                            const productValue = new ProductValue();
                            productValue.productAttributeId = attributeId;
                            productValue.productAttributeName = attributeName;
                            productValue.productAttributeValueId = value.id.toString();
                            productValue.productAttributeValueName = value.name;
                            this.listProductValue.push(productValue);
                        }
                    });
                } else {
                    const productValueSingle = new ProductValue();
                    productValueSingle.productAttributeId = attributeId;
                    productValueSingle.productAttributeName = attributeName;
                    productValueSingle.productAttributeValueId = values.id.toString();
                    productValueSingle.productAttributeValueName = values.name;
                    this.listProductValue.push(productValueSingle);
                }
            }
        }
    }

    removeSelectProductAttributeValue(value: NhSuggestion, productAttribute?: ProductCategoriesAttributeViewModel) {
        if (this.isUpdate) {
            const productAttributeValues = _.filter(this.listProductValue, (productValue: ProductValue) => {
                return productValue.productAttributeValueId === value.id;
            });

            if (productAttributeValues && productAttributeValues.length > 0 && productAttributeValues[0].id) {
                this.productService.deleteProductAttributeValue(this.productId, productAttributeValues[0].id).subscribe(() => {
                    _.remove(this.listProductValue, (item: ProductValue) => {
                        return item.productAttributeValueId === value.id;
                    });
                    if (productAttribute) {
                        _.remove(productAttribute.productAttributeValueSuggestion, (suggestion: NhSuggestion) => {
                            return suggestion.id === value.id;
                        });
                    }
                });
            }
        } else {
            _.remove(this.listProductValue, (item: ProductValue) => {
                return item.productAttributeValueId === value.id;
            });
            if (productAttribute) {
                _.remove(productAttribute.productAttributeValueSuggestion, (suggestion: NhSuggestion) => {
                    return suggestion.id === value.id;
                });
            }
        }
    }

    searchProductAttributeValue(attributeId: string, keyword: string) {
        this.productAttributeService.suggestionValue(attributeId, keyword).subscribe((result: SearchResultViewModel<NhSuggestion>) => {
            this.productCategoryAttributeValueSuggestions = result.items;
        });
    }

    searchProductAttributeSuggestions(keyword: string) {
        this.productAttributeService
            .suggestions(keyword)
            .subscribe((result: SearchResultViewModel<NhSuggestion>) => this.productAttributeSuggestions = result.items);
    }

    onSelectedProductAttribute(value: NhSuggestion) {
        if (value) {
            const existsProductAttribute = _.find(this.listAttribute, (item: ProductCategoriesAttributeViewModel) => {
                return item.attributeId === value.id;
            });

            if (existsProductAttribute) {
                this.toastr.error('Product attribute already exists');
                value.id = '';
                value.name = '';
                return;
            } else {
                this.productAttributeSelect = value;
            }
        }
    }

    remove(value: ProductCategoriesAttributeViewModel) {
        if (value) {

            if ((value.value || value.productAttributeValueSuggestion) && this.isUpdate) {
                this.productService.deleteProductAttributeValueByAttributeId(this.productId, value.attributeId).subscribe(() => {
                    const productAttributeValues = _.filter(this.listProductValue, (productValue: ProductValue) => {
                        return productValue.productAttributeId === value.attributeId;
                    });

                    if (productAttributeValues && productAttributeValues.length > 0 && productAttributeValues[0].id) {
                        _.remove(this.listAttribute, (item: ProductCategoriesAttributeViewModel) => {
                            return item.attributeId === value.attributeId;
                        });

                        _.remove(this.listProductValue, (productValue: ProductValue) => {
                            return productValue.productAttributeId === value.attributeId;
                        });
                    }
                });
            } else {
                _.remove(this.listAttribute, (item: ProductCategoriesAttributeViewModel) => {
                    return item.attributeId === value.attributeId;
                });

                _.remove(this.listProductValue, (productValue: ProductValue) => {
                    return productValue.productAttributeId === value.attributeId;
                });
            }

        }
    }

    save() {
        if (!this.isUpdate) {
            this.productService.insertAttributeValues(this.productId, this.listProductValue).subscribe((result: ActionResultViewModel) => {
            });
        }
    }

    onBlur(attributeId: string, attributeName: string, value) {
        if (!value) {
            this.toastr.error('Please enter value');
            return;
        }

        const productAttributeValues = _.filter(this.listProductValue, (productValue: ProductValue) => {
            return productValue.productAttributeId === attributeId && !productValue.productAttributeValueId;
        });

        if (this.productAttributeSelect) {
            this.productAttributeSelect.value = value;
        }

        const productAttributeValue = new ProductValue(attributeId, value, '', false);
        if (this.isUpdate) {
            if (productAttributeValues && productAttributeValues.length > 0) {
                this.productService.updateProductAttributeValue(this.productId, productAttributeValues[0].id,
                    productAttributeValue).subscribe(() => {
                });
            } else {
                this.productService.insertAttributeValue(this.productId,
                    productAttributeValue).subscribe((result: ActionResultViewModel) => {
                    productAttributeValue.id = result.data;
                    productAttributeValue.productAttributeIsSelfContent = true;
                    productAttributeValue.value = value;
                    productAttributeValue.productAttributeName = attributeName;
                    this.listProductValue.push(productAttributeValue);
                });
            }

            const productAttribute = this.getProductAttributeById(attributeId);
            productAttribute.value = value;
        } else {
            this.listProductValue.push(productAttributeValue);
        }
    }

    addAttribute() {
        const productAttribute = new ProductCategoriesAttributeViewModel();
        const listAttributeValue = _.filter(this.listProductValue, (value: ProductValue) => {
            return value.productAttributeId === this.productAttributeSelect.id;
        });

        productAttribute.attributeName = this.productAttributeSelect.name;
        productAttribute.attributeId = this.productAttributeSelect.id;
        productAttribute.isSelfContent = this.productAttributeSelect.isSelfContent;
        productAttribute.isMultiple = this.productAttributeSelect.isMultiple;
        productAttribute.value = this.productAttributeSelect.value;
        if (listAttributeValue && listAttributeValue.length > 0 && !this.productAttributeSelect.isSelfContent) {
            if (!this.productAttributeSelect.isSelfContent) {
                const productAttributeValueSuggestions: NhSuggestion[] = [];
                _.each(listAttributeValue, (productValue: ProductValue) => {
                    productAttributeValueSuggestions.push(new NhSuggestion(productValue.productAttributeValueId,
                        productValue.productAttributeValueName, '', true, true, productValue));
                });
                productAttribute.productAttributeValueSuggestion = productAttributeValueSuggestions;
            } else {
                productAttribute.value = listAttributeValue[0].value;
            }
        }
        this.listAttribute.push(productAttribute);
        this.productAttributeSelect = null;
    }

    private getProductAttributeById(attributeId: string) {
        if (attributeId) {
            const listProductAttribute = _.filter(this.listAttribute, (item: ProductCategoriesAttributeViewModel) => {
                return item.attributeId === attributeId;
            });

            if (listProductAttribute && listProductAttribute.length > 0) {
                return listProductAttribute[0];
            }
        }
    }

    private rendResult() {
        if (this.listProductValue && this.listProductValue.length > 0 && (this.isUpdate || this.isReadOnly)) {
            this.listAttribute = [];
            const groupByAttributeIds = _.groupBy(this.listProductValue, (productValue: ProductValue) => {
                return productValue.productAttributeId;
            });
            _.each(groupByAttributeIds, (groups: ProductValue[]) => {
                const attribute = groups[0];
                const productAttribute = new ProductCategoriesAttributeViewModel();
                productAttribute.attributeId = attribute.productAttributeId;
                productAttribute.attributeName = attribute.productAttributeName;
                productAttribute.isSelfContent = attribute.productAttributeIsSelfContent;
                productAttribute.isMultiple = attribute.productAttributeIsMultiple;
                const productAttributeValueSuggestions: NhSuggestion[] = [];
                _.each(groups, (group: ProductValue) => {
                    if (attribute.productAttributeIsSelfContent && group.value !== '') {
                        productAttribute.value = attribute.value;
                        productAttribute.productAttributeValueSuggestion = [];
                    } else {
                        productAttributeValueSuggestions.push(new NhSuggestion(group.productAttributeValueId,
                            group.productAttributeValueName, '', true, true, group));

                        productAttribute.productAttributeValueSuggestion = productAttributeValueSuggestions;
                    }
                });

                this.listAttribute.push(productAttribute);
            });
        }
    }
}

