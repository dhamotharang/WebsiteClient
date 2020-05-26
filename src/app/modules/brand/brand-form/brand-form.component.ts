import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {Brand} from '../model/brand.model';
import {BrandService} from '../services/brand.service';
import {BrandDetailViewModel} from '../viewmodel/brand-detail.viewmodel';
import {BaseFormComponent} from '../../../base-form.component';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {UtilService} from '../../../shareds/services/util.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {Pattern} from '../../../shareds/constants/pattern.const';
import {ExplorerItem} from '../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-product-brand-form',
    templateUrl: './brand-form.component.html'
})

export class BrandFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('brandFormModal', {static: true}) brandFormModal: NhModalComponent;
    brand = new Brand();

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
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

    removeImage() {
        this.model.patchValue({logo: ''});
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

    selectImage(value: ExplorerItem) {
        if (value.isImage) {
            this.model.patchValue({
                logo: value.absoluteUrl,
            });
        } else {
            this.toastr.error('Please select image');
        }
    }

    private getDetail(id: string) {
        this.subscribers.brandService = this.brandService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<BrandDetailViewModel>) => {
                    const detail = result.data;
                    if (detail) {
                        this.model.patchValue(detail);
                    }
                }
            );
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'phoneNumber', 'email', 'website', 'address', 'description', 'logo']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxLength', 'pattern']},
            {'phoneNumber': ['pattern', 'maxLength']},
            {'email': ['pattern', 'maxLength']},
            {'address': ['maxLength']},
            {'website': ['maxLength', 'pattern']},
            {'description': ['maxLength']},
            {'logo': ['maxLength']}
        ]);

        this.model = this.fb.group({
            name: [this.brand.name, [Validators.required, Validators.maxLength(256), Validators.pattern(Pattern.whiteSpace)]],
            phoneNumber: [this.brand.phoneNumber, [Validators.pattern(Pattern.phoneNumber), Validators.maxLength(50)]],
            email: [this.brand.email, [Validators.pattern(Pattern.email), Validators.maxLength(50)]],
            description: [this.brand.description, [Validators.maxLength(500)]],
            address: [this.brand.address, [Validators.maxLength(500)]],
            website: [this.brand.website, [Validators.maxLength(50), Validators.pattern(Pattern.url)]],
            isActive: [this.brand.isActive],
            logo: [this.brand.logo],
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
            description: '',
            logo: '',
        });
        this.clearFormError(this.formErrors);
    }
}
