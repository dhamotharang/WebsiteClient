import {Component, enableProdMode, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {Contact} from '../model/contact.model';
import {ContactService} from '../service/contact.service';
import * as _ from 'lodash';
import {ToastrService} from 'ngx-toastr';
import {BaseFormComponent} from '../../../../base-form.component';
import {UtilService} from '../../../../shareds/services/util.service';
import {WorkStatus} from '../../../../shareds/constants/work-status.const';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {Pattern} from '../../../../shareds/constants/pattern.const';

// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }

@Component({
    selector: 'app-product-contact-form',
    templateUrl: 'contact-form.component.html',
    providers: [ContactService]
})

export class ContactFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('contactFormModal') contactFormModal: NhModalComponent;
    @Input() type: number;
    @Input() subjectId: string;
    @Input() listContact: Contact[];

    @Output() insertSuccess = new EventEmitter();
    @Output() saveSuccess = new EventEmitter();

    contact = new Contact();
    listStatus = [{
        id: WorkStatus.official,
        name: 'Chính thức'
    }, {
        id: WorkStatus.quit,
        name: 'Nghỉ việc'
    }, {
        id: WorkStatus.transfer,
        name: 'Chuyển việc'
    }];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private contactService: ContactService,
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
        this.utilService.focusElement('fullName');
        this.renderForm();
        this.resetForm();
        this.contactFormModal.open();
    }

    edit(contact: Contact) {
        this.utilService.focusElement('fullName');
        this.isUpdate = true;
        this.id = contact.id;
        this.getDetail(contact);
        this.contactFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );
        if (isValid) {
            this.contact = this.model.value;
            this.contact.subjectId = this.subjectId;

            const countContact = _.countBy(this.listContact, (item: Contact) => {
                return item.phoneNumber === this.model.value.phoneNumber && item.fullName === this.model.value.fullName
                    && (!this.id || item.id !== this.id);
            }).true;

            if (countContact && countContact > 0) {
                this.toastr.error('User already exists');
                return;
            }

            this.isSaving = true;
            if (this.isUpdate) {
                if (this.subjectId) {
                    this.contactService
                        .update(this.id, this.type, this.contact)
                        .pipe(finalize(() => (this.isSaving = false)))
                        .subscribe((result: ActionResultViewModel) => {
                            this.isModified = true;
                            this.contact.concurrencyStamp = result.data;
                            this.saveSuccess.emit(this.contact);
                            this.contactFormModal.dismiss();
                        });
                } else {
                    this.isSaving = false;
                    this.saveSuccess.emit(this.contact);
                    this.contactFormModal.dismiss();
                }
            } else {
                if (this.subjectId) {
                    this.contactService
                        .insert(this.contact)
                        .pipe(finalize(() => (this.isSaving = false)))
                        .subscribe((result: ActionResultViewModel<{ contactId: string, concurrencyStamp: string }>) => {
                            const data = result.data;
                            if (data) {
                                this.isModified = true;
                                this.contact.id = data.contactId;
                                this.contact.concurrencyStamp = data.concurrencyStamp;
                                this.insertSuccess.emit(this.contact);
                                if (this.isCreateAnother) {
                                    this.utilService.focusElement('fullName');
                                    this.resetForm();
                                } else {
                                    this.contactFormModal.dismiss();
                                }
                            }
                        });
                } else {
                    this.isSaving = false;
                    this.insertSuccess.emit(this.contact);
                    if (this.isCreateAnother) {
                        this.utilService.focusElement('fullName');
                        this.resetForm();
                    } else {
                        this.contactFormModal.dismiss();
                    }
                }
            }
        }
    }

    private getDetail(contact: Contact) {
        if (contact) {
            this.model.patchValue(contact);
        }
        // this.subscribers.supplierService = this.contactService
        //     .getDetail(contact.id)
        //     .subscribe(
        //         (result: ActionResultViewModel<Contact>) => {
        //             const detail = result.data;
        //             if (detail) {
        //                 this.model.patchValue(detail);
        //             }
        //         }
        //     );
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['fullName', 'phoneNumber', 'email', 'positionName', 'description']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'fullName': ['required', 'maxLength', 'pattern']},
            {'email': ['pattern', 'maxlength']},
            {'phoneNumber': ['required', 'pattern', 'maxlength']},
            {'positionName': ['maxlength']},
            {'description': ['maxlength']}
        ]);

        this.model = this.fb.group({
            id: [this.contact.id],
            fullName: [this.contact.fullName, [Validators.required, Validators.maxLength(50), Validators.pattern(Pattern.whiteSpace)]],
            email: [this.contact.email, [Validators.maxLength(50), Validators.pattern(Pattern.email)]],
            phoneNumber: [this.contact.phoneNumber, [Validators.required, Validators.maxLength(50),
                Validators.pattern(Pattern.phoneNumber)]],
            positionName: [this.contact.positionName, [Validators.maxLength(500)]],
            description: [this.contact.description],
            status: [this.contact.status],
            subjectId: [this.subjectId],
            concurrencyStamp: [this.contact.concurrencyStamp]
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            id: null,
            fullName: '',
            phoneNumber: '',
            positionName: '',
            description: '',
            email: '',
            status: WorkStatus.official
        });
        this.clearFormError(this.formErrors);
    }
}
