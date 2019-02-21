import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProductDetailViewModel} from '../viewmodel/product-detail.viewmodel';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../service/product.service';
import {ProductImage} from '../model/product-image.model';
import {ProductCategoryViewModel} from '../viewmodel/product-category.viewmodel';
import * as _ from 'lodash';
import {ProductConversionUnit} from '../product-form/product-unit/model/product-conversion-unit.model';
import {ProductUnit} from '../product-form/product-unit/model/product-unit.model';
import {ProductUnitComponent} from '../product-form/product-unit/product-unit.component';
import {ProductValue} from '../product-form/product-attribute/model/product-value.model';
import {ProductFormAttributeComponent} from '../product-form/product-attribute/product-form-attribute.component';
import {BaseFormComponent} from '../../../../base-form.component';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['../product.scss'],
})

export class ProductDetailComponent extends BaseFormComponent implements OnInit {
    @ViewChild(ProductUnitComponent) productUnitComponent: ProductUnitComponent;
    @ViewChild(ProductFormAttributeComponent) productAttributeComponent: ProductFormAttributeComponent;
    productDetail: ProductDetailViewModel;
    categoryText;
    listProductUnit: ProductUnit[] = [];
    listProductUnitConversion: ProductConversionUnit[] = [];
    listProductValue: ProductValue[] = [];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private router: Router,
                private productService: ProductService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.PRODUCT, this.pageId.PRODUCT, 'Quản lý sản phẩm', 'Quản lý sản phẩm');
        this.subscribers.routerParam = this.route.params.subscribe((params: any) => {
                const id = params['id'];
                if (id) {
                    this.id = id;
                    this.isUpdate = true;
                    this.productService.getDetail(id).subscribe((result: ActionResultViewModel<ProductDetailViewModel>) => {
                        this.productDetail = result.data;
                        if (this.productDetail) {
                            if (this.productDetail.categories) {
                                const listCategoryByLanguageId = _.filter(this.productDetail.categories,
                                    (category: ProductCategoryViewModel) => {
                                        return category.languageId === this.currentLanguage;
                                    });
                                this.categoryText = _.join(_.map(listCategoryByLanguageId, (categoryNews: ProductCategoryViewModel) => {
                                    return categoryNews.categoryName;
                                }), ', ');
                            }
                            _.each(this.productDetail.images, (image: ProductImage) => {
                                if (image.url === this.productDetail.thumbnail) {
                                    image.isThumbnail = true;
                                } else {
                                    image.isThumbnail = false;
                                }
                            });

                            this.listProductUnit = this.productDetail.units;
                            this.listProductUnitConversion = this.productDetail.conversionUnits;
                            this.listProductValue = this.productDetail.values;
                            this.getUnitIdFromProductUnitId();
                        }
                    });
                }
            }
        );
    }

    edit() {
        this.router.navigate([`/products/edit/${this.productDetail.id}`]);
    }

    clickTabProductUnit(value) {
        this.productUnitComponent.renderListUnit();
    }

    clickTabProductAttribute(value) {
        this.productAttributeComponent.listProductValue = this.listProductValue;
        this.productAttributeComponent.getProductAttribute();
    }

    private getUnitIdFromProductUnitId() {
        if (this.listProductUnitConversion && this.listProductUnit && this.listProductUnit.length > 0
            && this.listProductUnitConversion.length > 0) {
            _.each(this.listProductUnitConversion, (unitConversion: ProductConversionUnit) => {
                const productUnitById = _.filter(this.listProductUnit, (unit: ProductUnit) => {
                    return unit.id === unitConversion.productUnitId;
                });

                if (productUnitById && productUnitById.length > 0) {
                    unitConversion.unitId = productUnitById[0].unitId;
                }

                const productUnitConversionById = _.filter(this.listProductUnit, (unitConvert: ProductUnit) => {
                    return unitConvert.id === unitConversion.productUnitConversionId;
                });

                if (productUnitConversionById && productUnitConversionById.length > 0) {
                    unitConversion.unitConversionId = productUnitConversionById[0].unitId;
                }
            });
        }
    }
}
