import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';
import {UtilService} from '../../../../../shareds/services/util.service';
import {finalize} from 'rxjs/operators';
import {NhModalComponent} from '../../../../../shareds/components/nh-modal/nh-modal.component';
import {BaseFormComponent} from '../../../../../base-form.component';
import {Brand} from '../model/brand.model';
import {BrandService} from '../services/brand.service';
import {BrandDetailViewModel} from '../viewmodel/brand-detail.viewmodel';
import {Pattern} from '../../../../../shareds/constants/pattern.const';

@Component({
    selector: 'app-product-brand-form',
    templateUrl: './brand-form.component.html'
})

export class BrandFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('brandFormModal') brandFormModal: NhModalComponent;
    brand = new Brand();

    constructor(private fb: FormBuilder,
                private brandService: BrandService,
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
        this.utilService.focusElement('name');
        this.renderForm();
        this.resetForm();
        this.brandFormModal.open();
    }

    edit(id: string) {
        this.utilService.focusElement('name');
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.brandFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );
        if (isValid) {
            this.brand = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.brandService
                    .update(this.id, this.brand)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.brandFormModal.dismiss();
                    });
            } else {
                this.brandService
                    .insert(this.brand)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('name');
                            this.resetForm();
                        } else {
                            this.brandFormModal.dismiss();
                        }
                    });
            }
        }
    }

    private getDetail(id: string) {
        this.subscribers.brandService = this.brandService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<BrandDetailViewModel>) => {
                    const detail = result.data;
                    if (detail) {
                        this.model.patchValue({
                            isActive: detail.isActive,
                            name: detail.name,
                            phoneNumber: detail.phoneNumber,
                            email: detail.email,
                            address: detail.address,
                            website: detail.website,
                            description: detail.description,
                            concurrencyStamp: detail.concurrencyStamp,
                        });
                    }
                }
            );
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'phoneNumber', 'email', 'website', 'address', 'description']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxLength', 'pattern']},
            {'phoneNumber': ['pattern', 'maxLength']},
            {'email': ['pattern', 'maxLength']},
            {'address': ['maxLength']},
            {'website': ['maxLength']},
            {'description': ['maxLength']},
        ]);

        this.model = this.fb.group({
            name: [this.brand.name, [Validators.required, Validators.maxLength(256), Validators.pattern(Pattern.whiteSpace)]],
            phoneNumber: [this.brand.phoneNumber, [Validators.pattern(Pattern.phoneNumber), Validators.maxLength(50)]],
            email: [this.brand.email, [Validators.pattern(Pattern.email), Validators.maxLength(50)]],
            description: [this.brand.description, [Validators.maxLength(500)]],
            address: [this.brand.address, [Validators.maxLength(500)]],
            website: [this.brand.website, [Validators.maxLength(50)]],
            isActive: [this.brand.isActive],
            concurrencyStamp: [this.brand.concurrencyStamp],
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            name: '',
            email: '',
            phoneNumber: '',
            website: '',
            isActive: true,
            address: '',
            description: ''
        });
        this.clearFormError(this.formErrors);
    }
}
