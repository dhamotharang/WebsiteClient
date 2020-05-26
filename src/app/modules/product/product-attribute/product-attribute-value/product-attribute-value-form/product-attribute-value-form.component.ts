import {Component, enableProdMode, Input, OnInit, ViewChild} from '@angular/core';
import { ProductAttributeService } from '../../product-attribute.service';
import { ProductAttribute } from '../../product-attribute-form/models/product-attribute.model';
import { FormGroup, Validators } from '@angular/forms';
import { ProductAttributeValue, ProductAttributeValueTranslation } from '../models/product-attribute-value.model';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import {BaseFormComponent} from '../../../../../base-form.component';
import {UtilService} from '../../../../../shareds/services/util.service';
import {NhModalComponent} from '../../../../../shareds/components/nh-modal/nh-modal.component';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';

// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }
@Component({
    selector: 'app-product-attribute-value-form',
    templateUrl: './product-attribute-value-form.component.html'
})
export class ProductAttributeValueFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('productAttributeValueFormModal', {static: true}) productAttributeValueFormModal: NhModalComponent;
    @Input() attributeId: string;
    productAttributeValue = new ProductAttributeValue();
    productAttributeValueTranslation = new ProductAttributeValueTranslation();

    constructor(
        private toastr: ToastrService,
        private utilService: UtilService,
        private productAttributeService: ProductAttributeService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    onModalShown() {
        this.isModified = false;
        this.focusValueName();
    }

    onModalHidden() {
        // console.log(this.isModified);
        this.resetModel();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    save() {
        const isLanguageValid = this.validateLanguage();
        if (isLanguageValid) {
            this.productAttributeValue = this.model.value;
            if (this.isUpdate) {
                this.model.markAsUntouched();
                this.productAttributeService.updateValue(this.attributeId, this.id, this.productAttributeValue)
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        this.productAttributeValueFormModal.dismiss();
                    });
            } else {
                this.productAttributeService.insertValue(this.attributeId, this.productAttributeValue)
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.resetModel();
                            this.focusValueName();
                        } else {
                            this.productAttributeValueFormModal.dismiss();
                        }
                    });
            }
        }
    }

    add() {
        this.isUpdate = false;
        this.productAttributeValueFormModal.open();
    }

    edit(id: string) {
        this.id = id;
        this.isUpdate = true;
        this.productAttributeValueFormModal.open();
        this.getDetail();
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
            name: [this.productAttributeValueTranslation.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            description: [this.productAttributeValueTranslation.description, [
                Validators.maxLength(4000)
            ]],
        });
        translationModel.valueChanges.subscribe((data: any) => this.validateTranslation(false));
        return translationModel;
    }

    private buildForm() {
        this.model = this.formBuilder.group({
            isActive: [this.productAttributeValue.isActive],
            concurrencyStamp: [this.productAttributeValue.concurrencyStamp],
            translations: this.formBuilder.array([])
        });
        this.model.valueChanges.subscribe(() => this.validateModel(false));
    }

    private getDetail() {
        return this.productAttributeService.getValueDetail(this.attributeId, this.id)
            .subscribe((attributeValueDetail: ProductAttributeValue) => {
                if (attributeValueDetail) {
                    this.model.patchValue({
                        isActive: attributeValueDetail.isActive,
                        concurrencyStamp: attributeValueDetail.concurrencyStamp
                    });
                    if (attributeValueDetail.translations && attributeValueDetail.translations.length > 0) {
                        this.translations.controls.forEach((model: FormGroup) => {
                            const detail = _.find(attributeValueDetail.translations, (translation: ProductAttributeValueTranslation) => {
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

    private focusValueName() {
        this.utilService.focusElement(`name-${this.currentLanguage}`);
    }
}
