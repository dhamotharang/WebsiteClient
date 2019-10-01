import {Component, enableProdMode, OnInit, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../../base-form.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {UtilService} from '../../../../shareds/services/util.service';
import {UnitService} from '../service/unit.service';
import {Unit} from '../model/unit.model';
import {UnitTranslations} from '../model/unit-translations.model';
import {UnitDetailViewModel} from '../view-model/unit-detail.viewmodel';
import * as _ from 'lodash';
import {Pattern} from '../../../../shareds/constants/pattern.const';

// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }

@Component({
    selector: 'app-product-unit-form',
    templateUrl: './unit-form.component.html',
    providers: [UnitService]
})

export class UnitFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('productUnitFormModal') productUnitFormModal: NhModalComponent;
    unit = new Unit();
    modelTranslation = new UnitTranslations();
    isGettingTree = false;

    constructor(private fb: FormBuilder,
                private unitService: UnitService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.renderForm();
    }

    onModalShow() {
        this.isModified = false;
    }

    onModalHidden() {
        this.isUpdate = false;
        this.resetForm();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    add() {
        this.utilService.focusElement('name ' + this.currentLanguage);
        this.renderForm();
        this.productUnitFormModal.open();
    }

    edit(id: string) {
        this.utilService.focusElement('name ' + this.currentLanguage);
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.productUnitFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );
        const isLanguageValid = this.validateLanguage();
        if (isValid && isLanguageValid) {
            this.unit = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.unitService
                    .update(this.id, this.unit)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.saveSuccessful.emit();
                        this.productUnitFormModal.dismiss();
                    });
            } else {
                this.unitService
                    .insert(this.unit)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('name ' + this.currentLanguage);
                            this.resetForm();
                        } else {
                            this.saveSuccessful.emit();
                            this.productUnitFormModal.dismiss();
                        }
                    });
            }
        }
    }


    private getDetail(id: string) {
        this.subscribers.productUnitService = this.unitService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<UnitDetailViewModel>) => {
                    const unitDetail = result.data;
                    if (unitDetail) {
                        this.model.patchValue({
                            isActive: unitDetail.isActive,
                            concurrencyStamp: unitDetail.concurrencyStamp,
                        });
                        if (unitDetail.translations && unitDetail.translations.length > 0) {
                            this.translations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        unitDetail.translations,
                                        (unitTranslation: UnitTranslations) => {
                                            return (
                                                unitTranslation.languageId ===
                                                model.value.languageId
                                            );
                                        }
                                    );
                                    if (detail) {
                                        model.patchValue(detail);
                                    }
                                }
                            );
                        }
                    }
                }
            );
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError([]);
        this.model = this.fb.group({
            isActive: [this.unit.isActive],
            concurrencyStamp: [this.unit.concurrencyStamp],
            translations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            isActive: true,
        });
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                abbreviation: '',
                description: '',
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name', 'abbreviation', 'description']
        );
        this.translationValidationMessage[
            language
            ] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxlength', 'pattern']},
            {abbreviation: ['required', 'maxlength', 'pattern']},
            {description: ['maxlength']},
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: [
                this.modelTranslation.name,
                [Validators.required, Validators.maxLength(256), Validators.pattern(Pattern.whiteSpace)]
            ],
            abbreviation: [
                this.modelTranslation.abbreviation,
                [Validators.required, Validators.maxLength(50),
                    Validators.pattern('^[a-zA-Z0-9]+$')]
            ],
            description: [
                this.modelTranslation.description,
                [Validators.maxLength(500)]
            ]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslation(false)
        );
        return translationModel;
    }
}
