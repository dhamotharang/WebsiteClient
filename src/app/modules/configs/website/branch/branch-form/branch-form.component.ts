import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BaseFormComponent} from '../../../../../base-form.component';
import {BranchDetailViewModel} from '../viewmodel/branch-detail.viewmodel';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';
import {BranchService} from '../branch.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../../../../../shareds/services/util.service';
import {BranchItem, ContactType} from '../model/branch-item.model';
import {BranchTranslation} from '../model/branch-translation.model';
import {Branch} from '../model/branch.model';
import {finalize} from 'rxjs/operators';
import * as _ from 'lodash';
import {Pattern} from '../../../../../shareds/constants/pattern.const';
import {ExplorerItem} from '../../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-config-website-branch-form',
    templateUrl: './branch-form.component.html',
    providers: [BranchService]
})

export class BranchFormComponent extends BaseFormComponent implements OnInit {
    @Output() onCloseForm = new EventEmitter();
    @Output() onSaveSuccess = new EventEmitter();
    branch = new Branch();
    listBranchItem: BranchItem[] = [];
    modelTranslation = new BranchTranslation();

    constructor(private utilService: UtilService,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private branchService: BranchService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
        this.inertDefaultBranchItem();
    }

    add() {
        this.utilService.focusElement('name ' + this.currentLanguage);
        this.isUpdate = false;
        this.renderForm();
        this.resetForm();
    }

    edit(id: string) {
        this.utilService.focusElement('name ' + this.currentLanguage);
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.branch = this.model.value;
            this.branch.branchItems = _.filter(this.listBranchItem, (item: BranchItem) => {
                return item.contactValue;
            });
            this.isSaving = true;
            if (this.isUpdate) {
                this.branchService.update(this.id, this.branch)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.onSaveSuccess.emit();
                    });
            } else {
                this.branchService.insert(this.branch)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.utilService.focusElement('name ' + this.currentLanguage);
                        this.isModified = true;
                        this.onSaveSuccess.emit();
                        this.resetForm();
                    });
            }
        }
    }

    getDetail(id: string) {
        this.branchService.getDetail(id).subscribe((result: ActionResultViewModel<BranchDetailViewModel>) => {
            const branchDetail = result.data;
            if (branchDetail) {
                this.model.patchValue({
                    id: branchDetail.id,
                    googleMap: branchDetail.link,
                    website: branchDetail.website,
                    workTime: branchDetail.workTime,
                    logo: branchDetail.logo,
                    isOffice: branchDetail.isOffice,
                    concurrencyStamp: branchDetail.concurrencyStamp,
                });
                this.listBranchItem = branchDetail.branchContactDetails;
                if (branchDetail.branchContactTranslations && branchDetail.branchContactTranslations.length > 0) {
                    this.modelTranslations.controls.forEach(
                        (model: FormGroup) => {
                            const detail = _.find(
                                branchDetail.branchContactTranslations,
                                (branchTranslations: BranchTranslation) => {
                                    return (
                                        branchTranslations.languageId ===
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
        });
    }

    onImageSelected(file: ExplorerItem) {
        if (file.isImage) {
            this.model.patchValue({logo: file.absoluteUrl});
        } else {
            this.toastr.error('Please select file image');
        }
    }

    closeForm() {
        this.onCloseForm.emit();
    }

    private inertDefaultBranchItem() {
        if (!this.listBranchItem || this.listBranchItem.length === 0) {
            this.listBranchItem.push(new BranchItem('', '', ContactType.email, '', true, true));
        }
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['googleMap', 'workTime', 'website', 'logo']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'googleMap': ['maxLength']},
            {'workTime': ['maxLength']},
            {'website': ['maxLength', 'pattern']},
            {'logo': ['maxLength']}
        ]);

        this.model = this.fb.group({
            workTime: [this.branch.workTime,
                [Validators.maxLength(256)]],
            googleMap: [this.branch.googleMap, [
                Validators.maxLength(500)
            ]],
            website: [this.branch.website, [Validators.maxLength(500), Validators.pattern(Pattern.url)]],
            logo: [this.branch.logo, [Validators.maxLength(500)]],
            isOffice: [this.branch.isOffice],
            concurrencyStamp: [this.branch.concurrencyStamp],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name', 'address']
        );
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxLength']},
            {address: ['maxLength']},
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: [
                this.modelTranslation.name,
                [Validators.required, Validators.maxLength(256)]
            ],
            address: [this.modelTranslation.address,
                [Validators.maxLength(500)]],
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslationModel(false)
        );
        return translationModel;
    };

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            id: null,
            workTime: '',
            googleMap: '',
            website: '',
            logo: '',
            isOffice: false,
            concurrencyStamp: '',
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                address: '',
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }
}
