import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../../base-form.component';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { OfficeService } from '../services/office.service';
import { OfficeContact } from '../models/office-contact.model';
import { UserSuggestion } from '../../../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.component';
import { FormBuilder, Validators } from '@angular/forms';
import { UtilService } from '../../../../../shareds/services/util.service';
import { IActionResultResponse } from '../../../../../interfaces/iaction-result-response.result';
import { finalize } from 'rxjs/operators';
import { Pattern } from '../../../../../shareds/constants/pattern.const';

@Component({
    selector: 'app-office-contact-form',
    templateUrl: './office-contact-form.component.html'
})

export class OfficeContactFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('officeContactFormModal') officeContactFormModal: NhModalComponent;
    @Input() officeId: number;
    contact = new OfficeContact();
    selectedUser: UserSuggestion;

    constructor(private fb: FormBuilder,
                private utilService: UtilService,
                private officeService: OfficeService) {
        super();
    }

    ngOnInit() {
        this.buildForm();
    }

    onModalHidden() {
        this.selectedUser = null;
        this.model.reset();
    }

    onUserSelected(user: UserSuggestion) {
        this.selectedUser = user;
        if (user) {
            this.model.patchValue({
                userId: user.id,
                fullName: user.fullName,
                avatar: user.avatar,
                officeName: '',
                positionName: ''
            });
        } else {
            this.model.patchValue({
                userId: null,
                fullName: null,
                avatar: null,
                officeName: null,
                positionName: null
            });
        }
    }

    add() {
        this.isUpdate = false;
        this.officeContactFormModal.open();
    }

    edit(officeContact: OfficeContact) {
        // this.isUpdate = true;
        // this.selectedUser = new UserSuggestion(officeContact.userId, officeContact.fullName, officeContact.officeName,
        //     officeContact.positionName, officeContact.avatar);
        // this.model.patchValue(officeContact);
        // this.officeContactFormModal.open();
    }

    save() {
        const isValid = this.validateModel(true);
        if (isValid) {
            if (this.isUpdate) {
                this.updateContact();
            } else {
                this.addContact();
            }
        }
    }

    private updateContact() {
        this.contact = this.model.value;
        if (this.officeId) {
            this.isSaving = true;
            this.officeService
                .updateContact(this.officeId, this.contact.id, this.contact)
                .pipe(finalize(() => this.isSaving = false))
                .subscribe(() => {
                    this.saveSuccessful.emit(this.contact);
                    this.officeContactFormModal.dismiss();
                });
        } else {
            this.saveSuccessful.emit(this.contact);
            this.officeContactFormModal.dismiss();
        }
    }

    private addContact() {
        this.contact = this.model.value;
        if (this.officeId) {
            this.isSaving = true;
            this.officeService
                .addContact(this.officeId, this.contact)
                .pipe(finalize(() => this.isSaving = false))
                .subscribe((result: IActionResultResponse) => {
                    this.contact.id = result.data;
                    this.saveSuccessful.emit(this.contact);
                    this.afterSave();
                });
        } else {
            this.contact.id = this.utilService
                .generateRandomNumber()
                .toString();
            this.saveSuccessful.emit(this.contact);
            this.afterSave();
        }
    }

    private buildForm() {
        this.formErrors = this.renderFormError(['userId', 'phoneNumber', 'email', 'fax']);
        this.validationMessages = this.renderFormErrorMessage([
            {'userId': ['required', 'maxlength']},
            {'phoneNumber': ['required', 'maxlength', 'pattern']},
            {'email': ['maxlength', 'pattern']},
            {'fax': ['maxlength', 'pattern']},
        ]);
        this.model = this.fb.group({
            id: [this.contact.id],
            userId: [this.contact.userId, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            fullName: [this.contact.fullName],
            avatar: [this.contact.avatar],
            officeName: [this.contact.officeName],
            positionName: [this.contact.positionName],
            phoneNumber: [this.contact.phoneNumber, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern(Pattern.phoneNumber)
            ]],
            email: [this.contact.email, [
                Validators.maxLength(500),
                Validators.pattern(Pattern.email)
            ]],
            fax: [this.contact.fax, [
                Validators.maxLength(50),
                Validators.pattern(Pattern.phoneNumber)
            ]]
        });
        this.model.valueChanges.subscribe(() => this.validateModel(false));
    }

    private afterSave() {
        if (this.isCreateAnother) {
            this.selectedUser = null;
            this.model.reset();
        } else {
            this.officeContactFormModal.dismiss();
        }
    }
}
