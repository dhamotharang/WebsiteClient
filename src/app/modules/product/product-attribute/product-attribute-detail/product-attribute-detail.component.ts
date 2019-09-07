import {Component, enableProdMode, OnInit, ViewChild} from '@angular/core';
import { ProductAttributeService } from '../product-attribute.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NhWizardComponent } from '../../../../shareds/components/nh-wizard/nh-wizard.component';
import { ProductAttributeValueComponent } from '../product-attribute-value/product-attribute-value.component';
import { ProductAttribute, ProductAttributeTranslation } from '../product-attribute-form/models/product-attribute.model';
import {BaseFormComponent} from '../../../../base-form.component';
import {NhTabComponent} from '../../../../shareds/components/nh-tab/nh-tab.component';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}
@Component({
    selector: 'app-product-attribute-detail',
    templateUrl: './product-attribute-detail.component.html'
})

export class ProductAttributeDetailComponent extends BaseFormComponent implements OnInit {
    @ViewChild('productAttributeFormModal') productAttributeFormModal: NhModalComponent;
    @ViewChild(ProductAttributeValueComponent ) productAttributeValueComponent: ProductAttributeValueComponent;
    @ViewChild('attributeFormWizard' ) attributeFormWizard: NhWizardComponent;
    @ViewChild(NhTabComponent ) nhTabComponent: NhTabComponent;
    productAttribute = new ProductAttribute();
    productAttributeTranslation = new ProductAttributeTranslation();
    isSelfContent = false;

    constructor(
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private productAttributeService: ProductAttributeService) {
        super();
        this.subscribers.routeParams = this.route.params.subscribe(params => {
            if (params.id) {
                this.id = params.id;
                this.getDetail();
            }
        });
    }

    ngOnInit() {
    }

    onWizardStepClick(step: any) {
        if (!this.isUpdate) {
            return;
        }
        this.attributeFormWizard.goTo(step.id);
        if (step.id === 2) {
            this.productAttributeValueComponent.search(1);
        }
    }

    onAttributeValueTabSelected() {
        this.productAttributeValueComponent.search(1);
    }

    private getDetail() {
        this.productAttributeService.getDetail(this.id)
            .subscribe((productAttributeDetail: ProductAttribute) => {
                if (productAttributeDetail) {
                    this.productAttribute = productAttributeDetail;
                }
            });
    }

    private searchProductAttributeValue() {
        this.productAttributeValueComponent.search(1);
    }

    private goToAttributeValueTab() {
        this.nhTabComponent.setTabActiveById('attributeValue');
    }
}
