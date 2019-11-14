import {AfterViewInit, Component, enableProdMode, OnInit, ViewChild} from '@angular/core';
import { BaseFormComponent } from '../../../../base-form.component';
import { ProductAttribute, ProductAttributeTranslation } from './models/product-attribute.model';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { FormGroup, Validators } from '@angular/forms';
import { ProductAttributeService } from '../product-attribute.service';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NhWizardComponent } from '../../../../shareds/components/nh-wizard/nh-wizard.component';
import * as _ from 'lodash';
import { ProductAttributeValueComponent } from '../product-attribute-value/product-attribute-value.component';
import {NhTabComponent} from '../../../../shareds/components/nh-tab/nh-tab.component';
import {UtilService} from '../../../../shareds/services/util.service';
import {Location} from '@angular/common';
// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }
@Component({
    selector: 'app-product-attribute-form',
    templateUrl: './product-attribute-form.component.html',
    providers: [Location]
})
export class ProductAttributeFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('productAttributeFormModal') productAttributeFormModal: NhModalComponent;
    @ViewChild(ProductAttributeValueComponent) productAttributeValueComponent: ProductAttributeValueComponent;
    @ViewChild('attributeFormWizard') attributeFormWizard: NhWizardComponent;
    @ViewChild(NhTabComponent) nhTabComponent: NhTabComponent;
    productAttribute = new ProductAttribute();
    productAttributeTranslation = new ProductAttributeTranslation();

    constructor(
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private utilService: UtilService,
        private location: Location,
        private productAttributeService: ProductAttributeService) {
        super();
        this.subscribers.routeParams = this.route.params.subscribe(params => {
            if (params.id) {
                this.isUpdate = true;
                this.id = params.id;
                this.getDetail();
            } else {
                this.isUpdate = false;
            }
        });
    }

    get isSelfContent() {
        return this.model.value.isSelfContent;
    }

    ngOnInit() {
        this.renderForm();
    }

    ngAfterViewInit() {
        this.utilService.focusElement(`attributeName${this.currentLanguage}`);
    }

    onModalShown() {
        this.isModified = false;
    }

    onModalHidden() {
        this.resetModel();
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

    onAttributeValueTabSelected(value) {
        this.productAttributeValueComponent.search(1);
    }

    // add() {
    //     this.isUpdate = false;
    //     this.productAttributeFormModal.open();
    // }

    save() {
        const isValid = this.validateModel();
        const isLanguageValid = this.validateLanguage();
        if (isValid && isLanguageValid) {
            this.productAttribute = this.model.value;
            if (this.isUpdate) {
                this.productAttributeService.update(this.id, this.productAttribute)
                    .subscribe((result: ActionResultViewModel) => {
                        // this.attributeFormWizard.next();
                        this.toastr.success(result.message);
                        if (this.isSelfContent) {
                            this.location.back();
                            // this.router.navigateByUrl('/products/attributes');
                        } else {
                            this.goToAttributeValueTab();
                            // this.toastr.success(result.message);
                            this.searchProductAttributeValue();
                            this.isModified = true;
                            this.model.patchValue({
                                concurrencyStamp: result.data
                            });
                            this.nhTabComponent.setTabActiveById('attributeValue');
                            this.goToAttributeValueTab();
                        }

                    });
            } else {
                this.productAttributeService.insert(this.productAttribute)
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        if (!this.isSelfContent) {
                            this.goToAttributeValueTab();
                            this.id = result.data;
                            this.model.patchValue({
                                id: result.data
                            });
                            if (!this.isCreateAnother) {
                                this.productAttributeFormModal.dismiss();
                            } else {
                                this.resetModel();
                            }
                        } else {
                            this.resetModel();
                            if (!this.isCreateAnother) {
                                this.location.back();
                                // this.router.navigateByUrl('/products/attributes');
                            }
                        }
                    });
            }
        }
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private resetModel() {
        this.id = null;
        this.isUpdate = false;
        this.model.patchValue(new ProductAttribute());
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                description: '',
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.renderFormError(['name', 'description']);
        this.translationValidationMessage[language] = this.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'description': ['maxlength']},
        ]);
        const translationModel = this.formBuilder.group({
            languageId: [language],
            name: [this.productAttributeTranslation.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            description: [this.productAttributeTranslation.description, [
                Validators.maxLength(4000)
            ]],
        });
        translationModel.valueChanges.subscribe((data: any) => this.validateTranslation(false));
        return translationModel;
    }

    private buildForm() {
        this.model = this.formBuilder.group({
            isActive: [this.productAttribute.isActive],
            isRequire: [this.productAttribute.isRequire],
            isMultiple: [this.productAttribute.isMultiple],
            isSelfContent: [this.productAttribute.isSelfContent],
            concurrencyStamp: [this.productAttribute.concurrencyStamp],
            translations: this.formBuilder.array([])
        });
        this.model.valueChanges.subscribe(() => this.validateModel(false));
    }

    private getDetail() {
        this.productAttributeService.getDetail(this.id)
            .subscribe((productAttributeDetail: ProductAttribute) => {
                if (productAttributeDetail) {
                    this.model.patchValue({
                        isActive: productAttributeDetail.isActive,
                        isMultiple: productAttributeDetail.isMultiple,
                        isSelfContent: productAttributeDetail.isSelfContent,
                        isRequire: productAttributeDetail.isRequire,
                        concurrencyStamp: productAttributeDetail.concurrencyStamp,
                    });
                    if (productAttributeDetail.translations && productAttributeDetail.translations.length > 0) {
                        this.translations.controls.forEach((model: FormGroup) => {
                            const detail = _.find(productAttributeDetail.translations, (translation: any) => {
                                return translation.languageId === model.value.languageId;
                            });
                            if (detail) {
                                model.patchValue(detail);
                            }
                        });
                    }
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
