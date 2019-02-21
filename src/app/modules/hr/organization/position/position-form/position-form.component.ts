import { Component, Inject, OnInit, Output, EventEmitter, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PositionService } from '../position.service';
import { Position } from '../position.model';
import { finalize } from 'rxjs/operators';
import { BaseFormComponent } from '../../../../../base-form.component';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { IPageId, PAGE_ID } from '../../../../../configs/page-id.config';
import { UtilService } from '../../../../../shareds/services/util.service';
import { SpinnerService } from '../../../../../core/spinner/spinner.service';
import { IActionResultResponse } from '../../../../../interfaces/iaction-result-response.result';
import { PositionTranslation } from '../models/position-translation.model';
import { PositionDetailViewModel } from '../models/position-detail.model';
import * as _ from 'lodash';
import { TitleService } from '../../title/title.service';
import { TitleSearchForSelectViewModel } from '../../title/title-search-for-select.viewmodel';
import { NhSuggestion } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { OfficeService } from '../../office/services/office.service';

@Component({
    selector: 'app-position-form',
    templateUrl: './position-form.component.html'
})

export class PositionFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('positionFormModal') positionFormModal: NhModalComponent;
    @Output() onSaveSuccess = new EventEmitter();
    position = new Position();
    titleTranslation = new PositionTranslation();
    titles: TitleSearchForSelectViewModel[] = [];
    selectedOffices: NhSuggestion[] = [];
    offices: NhSuggestion[] = [];
    isSearchingOffice = false;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private fb: FormBuilder,
                private renderer: Renderer2,
                private positionService: PositionService,
                private toastr: ToastrService,
                private utilService: UtilService,
                private officeService: OfficeService,
                private titleService: TitleService) {
        super();
    }

    ngOnInit(): void {
        if (this.titles.length === 0) {
            this.subscribers.getTitles = this.titleService.getAllActivated()
                .subscribe((result: TitleSearchForSelectViewModel[]) => {
                    this.titles = result;
                });
        }
        this.renderForm();
        this.utilService.focusElement('name');
    }

    onModalShown() {
        this.isModified = false;
    }

    onModalHidden() {
        this.validateModel(false);
        this.resetModel();
        this.isUpdate = false;
        this.selectedOffices = [];
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    onSelectedOffice(items: NhSuggestion[]) {
        this.selectedOffices = items;
    }

    onSearched(keyword: string) {
        this.isSearchingOffice = true;
        this.subscribers.searchSuggestionOffice = this.officeService
            .searchForSuggestion(keyword)
            .pipe(
                finalize(() => this.isSearchingOffice = false)
            )
            .subscribe((result: NhSuggestion[]) => this.offices = result);
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.isSaving = true;
            this.position = this.model.value;
            const selectedOfficeIds = this.selectedOffices.map((item: NhSuggestion) => {
                return item.id as number;
            });
            if (this.isUpdate) {
                this.positionService
                    .update(
                        this.position,
                        selectedOfficeIds
                    )
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.positionFormModal.dismiss();
                    });
            } else {
                this.positionService
                    .insert(
                        this.position,
                        selectedOfficeIds
                    )
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        if (!this.isCreateAnother) {
                            this.positionFormModal.dismiss();
                        } else {
                            this.validateModel(false);
                            this.resetModel();
                        }
                    });
            }
        }
    }

    add() {
        this.isUpdate = false;
        this.validateModel(false);
        this.positionFormModal.open();
    }

    edit(position: Position) {
        this.isUpdate = true;
        this.position = position;
        this.getDetail(position.id);
        this.positionFormModal.open();
    }

    private resetModel() {
        this.isUpdate = false;
        this.model.patchValue({
            id: '',
            titleId: '',
            isActive: true,
            isManager: false,
            isMultiple: false,
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                shortName: '',
                description: '',
                purpose: '',
                otherRequire: '',
                responsibility: ''
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private getDetail(id: string) {
        this.subscribers.getPositionDetail = this.positionService.getDetail(id)
            .subscribe((result: IActionResultResponse<PositionDetailViewModel>) => {
                const positionDetail = result.data;
                if (positionDetail) {
                    this.model.patchValue({
                        id: positionDetail.id,
                        isActive: positionDetail.isActive,
                        isMultiple: positionDetail.isMultiple,
                        isManager: positionDetail.isManager,
                        order: positionDetail.order,
                        titleId: positionDetail.titleId,
                        concurrencyStamp: positionDetail.concurrencyStamp,
                    });
                    if (positionDetail.positionTranslations && positionDetail.positionTranslations.length > 0) {
                        this.modelTranslations.controls.forEach((model: FormGroup) => {
                            const detail = _.find(positionDetail.positionTranslations, (positionTranslation: PositionTranslation) => {
                                return positionTranslation.languageId === model.value.languageId;
                            });
                            if (detail) {
                                model.patchValue(detail);
                            }
                        });
                    }
                    if (positionDetail.officesPositions && positionDetail.officesPositions.length > 0) {
                        this.selectedOffices = positionDetail.officesPositions;
                    }
                }
            });
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'shortName', 'description', 'titleId']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'shortName': ['required', 'maxlength']},
            {'description': ['maxlength']},
            {'titleId': ['required']},
        ]);

        this.model = this.fb.group({
            id: [this.position.id],
            titleId: [this.position.titleId, [
                Validators.required
            ]],
            isManager: [this.position.isManager],
            isMultiple: [this.position.isMultiple],
            isActive: [this.position.isActive],
            concurrencyStamp: [this.position.concurrencyStamp],
            modelTranslations: this.fb.array([])
        });

        this.model.valueChanges.subscribe(data =>
            this.validateFormGroup(this.model, this.formErrors, this.validationMessages));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(['name', 'shortName', 'description']);
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'description': ['maxlength']},
            {'shortName': ['required', 'maxlength']}
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: [this.titleTranslation.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            shortName: [this.titleTranslation.shortName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            description: [this.titleTranslation.description, [
                Validators.maxLength(500)
            ]],
            otherRequire: [this.titleTranslation.otherRequire],
            responsibility: [this.titleTranslation.responsibility],
            purpose: [this.titleTranslation.purpose],
        });
        translationModel.valueChanges.subscribe((data: any) => this.validateTranslationModel(false));
        return translationModel;
    };
}
