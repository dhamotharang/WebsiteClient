import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    Inject,
    ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OfficeTitleComponent } from '../office-title/office-title.component';
import { OfficeService } from '../services/office.service';
import { Office } from '../models/office.model';
import { finalize } from 'rxjs/operators';
import { BaseFormComponent } from '../../../../../base-form.component';
import { TreeData } from '../../../../../view-model/tree-data';
import { IPageId, PAGE_ID } from '../../../../../configs/page-id.config';
import { SpinnerService } from '../../../../../core/spinner/spinner.service';
import { UtilService } from '../../../../../shareds/services/util.service';
import { IActionResultResponse } from '../../../../../interfaces/iaction-result-response.result';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { OfficeTranslation } from '../models/office-translation.model';
import { OfficeContact } from '../models/office-contact.model';
import * as _ from 'lodash';
import { OfficeEditViewModel } from '../models/office-edit.viewmodel';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
    selector: 'app-office-form',
    templateUrl: './office-form.component.html',
    providers: [
        OfficeService,
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
    ]
})
export class OfficeFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('officeFormModal') officeFormModal: NhModalComponent;
    @ViewChild(OfficeTitleComponent) officeTitleComponent: OfficeTitleComponent;
    @Input() elementId: string;
    @Output() onEditorKeyup = new EventEmitter<any>();
    @Output() onCloseForm = new EventEmitter<any>();

    office = new Office();
    contact = new OfficeContact();
    contactModel: FormGroup;
    officeTree: TreeData[] = [];
    modelTranslation = new OfficeTranslation();
    contactFormErrors = {};
    contactValidationMessages = {};

    isGettingTree = false;
    officeTypes = [];
    contacts: OfficeContact[] = [];

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                private location: Location,
                private fb: FormBuilder,
                private officeService: OfficeService,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private utilService: UtilService) {
        super();
        this.renderOfficeType();
    }

    ngOnInit(): void {
        this.office = new Office();
        this.renderForm();
        this.getOfficeTree();
    }

    onModalShow() {
        this.isModified = false;
    }

    onModalHidden() {
        this.isUpdate = false;
        this.resetForm();
        this.location.go('/organization/offices');
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    add() {
        this.getOfficeTree();
        this.validateModel(false);
        this.officeFormModal.open();
    }

    edit(id: number) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.officeFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.office = this.model.value;
            this.office.officeContacts = this.contacts;
            this.isSaving = true;
            if (this.isUpdate) {
                this.officeService
                    .update(this.id, this.office)
                    .pipe(
                        finalize(() => (this.isSaving = false)),
                    )
                    .subscribe(() => {
                        this.isModified = true;
                        this.officeFormModal.dismiss();
                    });
            } else {
                this.officeService
                    .insert(this.office)
                    .pipe(
                        finalize(() => (this.isSaving = false)),
                    )
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.getOfficeTree();
                            this.resetForm();
                        } else {
                            this.officeFormModal.dismiss();
                        }
                    });
            }
        }
    }

    // saveContact() {
    //     const isValid = this.validateFormGroup(
    //         this.contactModel,
    //         this.contactFormErrors,
    //         this.contactValidationMessages,
    //         true
    //     );
    //     if (isValid) {
    //         this.contact = this.contactModel.value;
    //         const existsByUserId = _.countBy(
    //             this.contacts,
    //             (contact: OfficeContact) => {
    //                 return contact.userId === this.contact.userId;
    //             }
    //         ).true;
    //         if (existsByUserId && existsByUserId > 0) {
    //             return;
    //         }
    //         if (this.isUpdateContact) {
    //             this.updateContact();
    //         } else {
    //             this.addContact();
    //         }
    //     }
    // }

    closeForm() {
        this.onCloseForm.emit();
    }

    reloadTree() {
        this.isGettingTree = true;
        this.officeService.getTree().subscribe((result: any) => {
            this.isGettingTree = false;
            this.officeTree = result;
        });
    }

    onParentSelect(office: TreeData) {
        this.model.patchValue({parentId: office ? office.id : null});
    }

    showListTitleTab() {
        this.officeTitleComponent.search(1);
    }

    private getDetail(id: number) {
        this.subscribers.officeDetail = this.officeService
            .getEditDetail(id)
            .subscribe(
                (result: IActionResultResponse<OfficeEditViewModel>) => {
                    const officeDetail = result.data;
                    if (officeDetail) {
                        this.model.patchValue({
                            code: officeDetail.code,
                            isActive: officeDetail.isActive,
                            order: officeDetail.order,
                            officeType: officeDetail.officeType,
                            parentId: officeDetail.parentId
                        });
                        if (officeDetail.officeTranslations && officeDetail.officeTranslations.length > 0) {
                            this.modelTranslations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        officeDetail.officeTranslations,
                                        (officeTranslation: OfficeTranslation) => {
                                            return (
                                                officeTranslation.languageId ===
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
                        if (
                            officeDetail.officeContacts &&
                            officeDetail.officeContacts.length > 0
                        ) {
                            this.contacts = officeDetail.officeContacts;
                        }
                    }
                }
            );
    }

    private getOfficeTree() {
        this.subscribers.getTree = this.officeService
            .getTree()
            .subscribe((result: TreeData[]) => {
                this.officeTree = result;
            });
    }

    private renderForm() {
        this.buildForm();
        this.buildContactForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError([
            'name',
            'description',
            'code'
        ]);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {officeType: ['required']},
            {code: ['required', 'maxlength', 'pattern']}
        ]);
        this.model = this.fb.group({
            officeType: [this.office.officeType],
            // 'email': [this.office.email, [
            //     Validators.maxLength(150),
            //     Validators.pattern(
            //         '(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})'
            //     )
            // ]],
            code: [this.office.code, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[a-zA-Z0-9]+$')
            ]],
            order: [this.office.order],
            parentId: [this.office.parentId],
            isActive: [this.office.isActive],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            officeType: 0,
            order: 0,
            code: 0,
            parentId: null,
            isActive: true
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                shortName: '',
                description: '',
                address: ''
            });
        });
        this.contacts = [];
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private renderOfficeType() {
        this.officeTypes = [
            {id: 0, name: 'Normal'},
            {id: 1, name: 'Hr'},
            {id: 2, name: 'Directors'},
            {id: 3, name: 'Stand alone company'}
        ];
    }

    private buildContactForm() {
        this.contactFormErrors = this.utilService.renderFormError(['userId']);
        this.contactValidationMessages = this.utilService.renderFormErrorMessage(
            [
                {userId: ['required']},
                {phoneNumber: ['maxlength']},
                {email: ['maxlength']},
                {fax: ['maxlength']}
            ]
        );
        this.contactModel = this.fb.group({
            userId: [this.contact.userId],
            fullName: [this.contact.fullName],
            avatar: [this.contact.avatar],
            phoneNumber: [this.contact.phoneNumber, [Validators.maxLength(50)]],
            email: [this.contact.email, [Validators.maxLength(50)]],
            fax: [this.contact.fax, [Validators.maxLength(50)]]
        });
        this.contactModel.valueChanges.subscribe(() =>
            this.validateFormGroup(
                this.contactModel,
                this.contactFormErrors,
                this.contactValidationMessages,
                false
            )
        );
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name', 'shortName', 'address', 'description']
        );
        this.translationValidationMessage[
            language
            ] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxlength']},
            {description: ['maxlength']},
            {address: ['maxlength']},
            {shortName: ['required', 'maxlength']}
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: [
                this.modelTranslation.name,
                [Validators.required, Validators.maxLength(256)]
            ],
            shortName: [
                this.modelTranslation.shortName,
                [Validators.required, Validators.maxLength(50)]
            ],
            address: [
                this.modelTranslation.address,
                [Validators.maxLength(500)]
            ],
            description: [
                this.modelTranslation.description,
                [Validators.maxLength(500)]
            ]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslationModel(false)
        );
        return translationModel;
    };
}
