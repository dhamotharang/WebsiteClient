import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {BaseFormComponent} from '../../../../base-form.component';
import {EmailService} from '../service/email.service';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {FormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {UtilService} from '../../../../shareds/services/util.service';
import {Email} from '../model/email.model';
import {EmailDetailViewModel} from '../viewmodel/email-detail.viewmodel';
import {NumberValidator} from '../../../../validators/number.validator';
import {EmailTypeService} from '../email-type/email-type.service';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {EmailType} from '../email-type/email-type.model';
import {Pattern} from '../../../../shareds/constants/pattern.const';
import {EmailSearchViewModel} from '../viewmodel/email-search.viewmodel';

@Component({
    selector: 'app-config-email-form',
    templateUrl: './email-form.component.html',
    providers: [NumberValidator, EmailService, EmailTypeService]
})

export class EmailFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('emailFormModal') emailFormModal: NhModalComponent;
    @Output() onSaveSuccess = new EventEmitter();
    listEmailType;
    email = new Email();

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private emailService: EmailService,
                private emailTypeService: EmailTypeService,
                private numberValidator: NumberValidator) {
        super();
    }

    ngOnInit() {
        this.renderForm();
        this.emailTypeService.search(1, 1000).subscribe((result: SearchResultViewModel<EmailType>) => {
            this.listEmailType = result.items;
        });
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
        this.renderForm();
        this.emailFormModal.open();
    }

    edit(email: EmailSearchViewModel) {
        this.utilService.focusElement('name');
        this.isUpdate = true;
        this.id = email.id;
        this.getDetail(email);
        this.emailFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.email = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.emailService.update(this.id, this.email)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.emailFormModal.dismiss();
                    });
            } else {
                this.emailService.insert(this.email)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('name');
                            this.resetForm();
                        } else {
                            this.saveSuccessful.emit();
                            this.emailFormModal.dismiss();
                        }
                    });
            }
        }
    }

    getDetail(email: EmailSearchViewModel) {
        this.emailService
            .getDetail(email.id)
            .subscribe(
                (result: ActionResultViewModel<EmailDetailViewModel>) => {
                    const emailDetail = result.data;
                    if (emailDetail) {
                        this.model.patchValue({
                            owner: emailDetail.owner,
                            email: emailDetail.email,
                            password: emailDetail.password,
                            isActive: emailDetail.isActive,
                            mailTypeId: emailDetail.mailTypeId,
                            concurrencyStamp: emailDetail.concurrencyStamp,
                        });
                    }
                }
            );
    }

    closeModal() {
        this.emailFormModal.dismiss();
    }

    selectEmailType(value) {
        if (value) {
            this.model.patchValue({mailTypeId: value.id});
        }
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['owner', 'email', 'password', 'mailTypeId']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'owner': ['required', 'maxLength']},
            {'email': ['required', 'maxLength']},
            {'password': ['required', 'maxLength']},
            {'mailTypeId': ['required']}
        ]);

        this.model = this.fb.group({
            mailTypeId: [this.email.mailTypeId, [Validators.required]],
            email: [this.email.email,
                [Validators.required, Validators.maxLength(50),
                    Validators.pattern(Pattern.email)]],
            owner: [this.email.owner, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            password: [this.email.password, [Validators.maxLength(50), Validators.required]],
            isActive: [this.email.isActive],
            concurrencyStamp: [this.email.concurrencyStamp]
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            mailTypeId: '',
            owner: '',
            email: '',
            password: '',
            isActive: '',
            concurrencyStamp: '',
        });
        this.clearFormError(this.formErrors);
    }
}
