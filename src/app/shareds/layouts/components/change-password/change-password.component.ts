import { Component, OnInit, ViewChild } from '@angular/core';
import { NhModalComponent } from '../../../components/nh-modal/nh-modal.component';
import { BaseFormComponent } from '../../../../base-form.component';
import { AccountService } from './account.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ChangePassword } from './change-password.model';
import { EqualValidator } from '../../../../validators/validator-equal.validator';
import { UtilService } from '../../../services/util.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    providers: [EqualValidator, AccountService]
})

export class ChangePasswordComponent extends BaseFormComponent implements OnInit {
    @ViewChild('changePasswordModal', {static: true}) changePasswordModal: NhModalComponent;
    changePassword = new ChangePassword();

    constructor(private accountService: AccountService,
                private equalValidator: EqualValidator,
                private utilService: UtilService,
                private authService: AuthService,
                private fb: FormBuilder) {
        super();
    }

    ngOnInit() {
        this.buildForm();
    }

    show() {
        this.changePasswordModal.open();
        this.utilService.focusElement('oldPassword');
    }

    save() {
        const isValid = this.validateModel(true);
        if (isValid) {
            this.changePassword = this.model.value;
            this.subscribers.changePassword = this.accountService.updatePassword(this.changePassword)
                .subscribe(() => {
                    this.model.reset();
                    this.authService.signOut();
                    window.location.reload();
                    // setTimeout(() => {
                    //     this.changePasswordModal.dismiss();
                    // }, 500);
                });
        }
    }

    private buildForm() {
        this.formErrors = this.renderFormError(['oldPassword', 'newPassword', 'confirmNewPassword']);
        this.validationMessages = this.renderFormErrorMessage([
            {'oldPassword': ['required', 'maxlength']},
            {'newPassword': ['required', 'maxlength']},
            {'confirmNewPassword': ['required', 'maxlength', 'validateEqual']},
        ]);
        this.model = this.fb.group({
            oldPassword: [this.changePassword.oldPassword, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            newPassword: [this.changePassword.newPassword, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            confirmNewPassword: [this.changePassword.confirmNewPassword, [
                Validators.required,
                Validators.maxLength(50),
                this.equalValidator.validate('newPassword')
            ]]
        });
        this.model.valueChanges.subscribe(() => this.validateModel(false));
    }
}
