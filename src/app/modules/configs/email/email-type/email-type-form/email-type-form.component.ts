import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../../../base-form.component';
import {NhModalComponent} from '../../../../../shareds/components/nh-modal/nh-modal.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../../../../../shareds/services/util.service';
import {finalize} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {NumberValidator} from '../../../../../validators/number.validator';
import {EmailTypeService} from '../email-type.service';
import {EmailType} from '../email-type.model';

@Component({
    selector: 'app-config-email-type-form',
    templateUrl: './email-type-form.component.html',
    providers: [NumberValidator, EmailTypeService]
})

export class EmailTypeFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('emailTypeFormModal') emailTypeFormModal: NhModalComponent;
    @Output() onSaveSuccess = new EventEmitter();

    emailType = new EmailType();

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private emailTypeService: EmailTypeService,
                private numberValidator: NumberValidator) {
        super();
    }

    ngOnInit() {
        this.buildForm();
    }

    onFormModalShown() {
        this.isModified = false;
    }

    onFormModalHidden() {
        this.isUpdate = false;
        this.resetForm();
        if (this.isModified) {
            this.onSaveSuccess.emit();
        }
    }

    add() {
        this.utilService.focusElement('name');
        this.isUpdate = false;
        this.buildForm();
        this.emailTypeFormModal.open();
    }

    edit(emailType: EmailType) {
        this.utilService.focusElement('name');
        this.isUpdate = true;
        this.id = emailType.id;
        this.model.patchValue({
            host: emailType.host,
            name: emailType.name,
            port: emailType.port,
            ssl: emailType.ssl,
            concurrencyStamp: emailType.concurrencyStamp,
        });
        this.emailTypeFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.emailType = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.emailTypeService.update(this.id, this.emailType)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.emailTypeFormModal.dismiss();
                    });
            } else {
                this.emailTypeService.insert(this.emailType)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('name');
                            this.resetForm();
                        } else {
                            this.saveSuccessful.emit();
                            this.emailTypeFormModal.dismiss();
                        }
                    });
            }
        }
    }

    closeModal() {
        this.emailTypeFormModal.dismiss();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'port', 'host', 'ssl']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxLength']},
            {'port': ['required', 'invalid']},
            {'host': ['required', 'maxLength']},
            {'ssl': ['required', 'isValid']},
        ]);

        this.model = this.fb.group({
            name: [this.emailType.name,
                [Validators.required, Validators.maxLength(256)]],
            host: [this.emailType.host, [
                Validators.required,
                Validators.maxLength(256)]
            ],
            port: [this.emailType.port, [
                Validators.required,
                this.numberValidator.isValid
            ]],
            ssl: [this.emailType.ssl],
            concurrencyStamp: [this.emailType.concurrencyStamp]
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            host: '',
            name: '',
            port: 0,
            ssl: '',
            concurrencyStamp: '',
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                description: '',
            });
        });
        this.clearFormError(this.formErrors);
    }
}
