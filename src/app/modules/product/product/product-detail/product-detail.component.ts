import {AfterViewInit, Component, enableProdMode, Inject, OnInit, ViewChild} from '@angular/core';
import { Product } from '../model/product.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProductImage } from '../model/product-image.model';
import { ProductTranslation } from '../model/product-translation.model';
import { ProductService } from '../service/product.service';
import * as _ from 'lodash';
import { ProductCategoryService } from '../../product-category/service/product-category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductDetailViewModel } from '../viewmodel/product-detail.viewmodel';
import { ProductFormAttributeComponent } from '../product-form/product-attribute/product-form-attribute.component';
import { ProductUnitComponent } from '../product-form/product-unit/product-unit.component';
import { ProductConversionUnit } from '../product-form/product-unit/model/product-conversion-unit.model';
import { ProductAttribute } from '../product-form/product-attribute/model/product-value.model';
import {NumberValidator} from '../../../../validators/number.validator';
import {BaseFormComponent} from '../../../../base-form.component';
import {UtilService} from '../../../../shareds/services/util.service';
import {NhTabComponent} from '../../../../shareds/components/nh-tab/nh-tab.component';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {TreeData} from '../../../../view-model/tree-data';
import {NhSuggestion} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';

// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }
@Component({
    selector: 'app-product-form',
    templateUrl: './product-detail.component.html',
    styleUrls: ['../product.scss'],
    providers: [UtilService, NumberValidator]
})

export class ProductDetailComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild(ProductUnitComponent) productUnitComponent: ProductUnitComponent;
    @ViewChild(ProductFormAttributeComponent) productAttributeComponent: ProductFormAttributeComponent;
    @ViewChild(NhTabComponent) nhTabComponent: NhTabComponent;
    @ViewChild('productFormModal') productFormModal: NhModalComponent;
    product = new Product();
    categoryTree: TreeData[];
    categories: any[];
    productImages: ProductImage[] = [];
    modelTranslation = new ProductTranslation();
    conversionUnits = [];
    attributes = [];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private numberValidator: NumberValidator,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private route: ActivatedRoute,
                private router: Router,
                private productCategoryService: ProductCategoryService,
                private productService: ProductService) {
        super();
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        this.reloadTree();
    }

    add() {
        this.productFormModal.open();
    }

    show(productId: string) {
        this.id = productId;
        this.isUpdate = true;
        this.getDetail(productId);
    }

    reloadTree() {
        this.productCategoryService.getTree().subscribe((result: TreeData[]) => {
            this.categoryTree = result;
        });
    }

    checkThumbnail(item: ProductImage) {
        if (!item.isThumbnail) {
            _.each(this.productImages, (image: ProductImage) => {
                image.isThumbnail = false;
            });
            this.model.patchValue({thumbnail: item.url});
        }
        item.isThumbnail = !item.isThumbnail;
    }

    private getDetail(productId: string) {
        this.productFormModal.open();
        this.subscribers.getDetail = this.productService.getDetail(productId)
            .subscribe((result: ProductDetailViewModel) => {
                this.product = {
                    unitId: result.unitId,
                    unitName: result.unitName,
                    isActive: result.isActive,
                    isHot: result.isHot,
                    isHomePage: result.isHomePage,
                    isManagementByLot: result.isManagementByLot,
                    salePrice: result.salePrice,
                    translations: result.translations,
                    concurrencyStamp: result.concurrencyStamp,
                    thumbnail: result.thumbnail,
                    images: result.images
                } as Product;
                this.productImages = result.images;
                if (result.categories) {
                    this.categories = result.categories;
                }
                if (result.conversionUnits && result.conversionUnits.length > 0) {
                    this.conversionUnits = result.conversionUnits;
                }
                if (result.attributes) {
                    const groups = _.groupBy(result.attributes, 'attributeId');
                    if (groups) {
                        // this.attributes.removeAt(0);
                        let index = 0;
                        for (const key in groups) {
                            if (groups.hasOwnProperty(key)) {
                                const groupItem: ProductAttribute = groups[key][0];
                                const productAttributeValue: ProductAttribute = {
                                    id: groupItem.id,
                                    attributeId: groupItem.attributeId,
                                    attributeName: groupItem.attributeName,
                                    value: groupItem.value,
                                    isSelfContent: groupItem.isSelfContent,
                                    isMultiple: groupItem.isMultiple,
                                    isShowClient: groupItem.isShowClient,
                                    attributeValues: groups[key].map((group: ProductAttribute) => {
                                        return {
                                            id: group.attributeValueId,
                                            name: group.attributeValueName
                                        };
                                    })
                                };
                                // this.attributes.push(this.buildAttributeForm(index, productAttributeValue));
                                this.attributes = [...this.attributes, productAttributeValue];
                            }
                            index++;
                        }
                    }
                }
                if (result.images) {
                    this.productImages = result.images;
                    _.each(this.productImages, (image: ProductImage) => {
                        if (image.url === result.thumbnail) {
                            image.isThumbnail = true;
                        } else {
                            image.isThumbnail = false;
                        }
                    });
                }
            });
    }
}
