import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Account } from '../models/account.model';
import { BaseFormComponent } from '../../../../base-form.component';
import { ToastrService } from 'ngx-toastr';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { finalize } from 'rxjs/operators';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { AccountService } from '../account.service';

@Component({
    selector: 'app-account-form',
    templateUrl: './account-form.component.html'
})

export class AccountFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('accountFormModal') accountFormModal: NhModalComponent;
    account: Account = new Account();

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private accountService: AccountService) {
        super();
    }

    ngOnInit() {
        this.buildForm();
    }

    onModalHidden() {
        this.model.reset(new Account());
        this.isUpdate = false;
        if (this.isModified) {
            this.saveSuccessful.emit();
            this.clearFormError(this.formErrors);
        }
    }

    add() {
        this.isUpdate = false;
        this.accountFormModal.open();
    }

    edit(id: string, account: Account) {
        this.id = id;
        this.account = account;
        this.isUpdate = true;
        this.model.patchValue(account as any);
        this.accountFormModal.open();
    }

    save() {
        if (this.isUpdate) {
            this.model.patchValue({
                password: '1',
                confirmPassword: '1'
            });
        }
        const isValid = this.validateModel();
        if (isValid) {
            this.isSaving = true;
            this.account = this.model.value;
            if (this.isUpdate) {
                this.accountService.update(this.id, this.account)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        this.accountFormModal.dismiss();
                    });
            } else {
                this.accountService.insert(this.account)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.model.reset();
                        } else {
                            this.accountFormModal.dismiss();
                        }
                    });
            }
        }
    }

    private buildForm() {
        this.formErrors = this.renderFormError(['userName', 'fullName', 'email', 'phoneNumber', 'password', 'confirmPassword']);
        this.validationMessages = this.renderFormErrorMessage([
            {'userName': ['required', 'maxlength', 'pattern']},
            {'fullName': ['required', 'maxlength']},
            {'email': ['required', 'maxlength', 'pattern']},
            {'phoneNumber': ['required', 'maxlength', 'pattern']},
            {'password': ['required']},
            {'confirmPassword': ['required']}
        ]);
        this.model = this.fb.group({
            userName: [this.account.userName, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[a-z0-9]+([-_\\.][a-z0-9]+)*[a-z0-9]$')
            ]],
            fullName: [this.account.fullName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            email: [this.account.email, [
                Validators.required,
                Validators.maxLength(500),
                Validators.pattern('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')
            ]],
            password: [this.account.password, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            confirmPassword: [this.account.confirmPassword, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            phoneNumber: [this.account.phoneNumber, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$')
            ]],
            isActive: [this.account.isActive],
        });

        this.subscribers.modelValueChanges = this.model.valueChanges.subscribe(() => this.validateModel(false));
    }
}
