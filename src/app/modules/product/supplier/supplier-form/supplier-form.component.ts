import {Component, enableProdMode, OnInit, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../../base-form.component';
import {UtilService} from '../../../../shareds/services/util.service';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {FormBuilder, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {Supplier} from '../model/supplier.model';
import {SupplierService} from '../service/supplier.service';
import {Contact} from '../../contact/model/contact.model';
import {SupplierDetailViewModel} from '../viewmodel/supplier-detail.viewmodel';
import {ContactType} from '../../../../shareds/constants/contact-type.const';
import {Pattern} from '../../../../shareds/constants/pattern.const';
// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }
@Component({
    selector: 'app-product-supplier-form',
    templateUrl: './supplier-form.component.html'
})

export class SupplierFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('supplierFormModal') supplierFormModal: NhModalComponent;
    supplier = new Supplier();
    listContact: Contact[] = [];
    contactType = ContactType;

    constructor(private fb: FormBuilder,
                private supplierService: SupplierService,
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
        this.supplierFormModal.open();
    }

    edit(id: string) {
        this.utilService.focusElement('name');
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.supplierFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );
        if (isValid) {
            this.supplier = this.model.value;
            this.supplier.contacts = !this.isUpdate ? this.listContact : [];
            this.isSaving = true;
            if (this.isUpdate) {
                this.supplierService
                    .update(this.id, this.supplier)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.supplierFormModal.dismiss();
                    });
            } else {
                this.supplierService
                    .insert(this.supplier)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('name');
                            this.resetForm();
                        } else {
                            this.supplierFormModal.dismiss();
                        }
                    });
            }
        }
    }

    private getDetail(id: string) {
        this.subscribers.supplierService = this.supplierService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<SupplierDetailViewModel>) => {
                    const detail = result.data;
                    if (detail) {
                        this.model.patchValue({
                            isActive: detail.isActive,
                            name: detail.name,
                            address: detail.address,
                            description: detail.description,
                            concurrencyStamp: detail.concurrencyStamp,
                        });

                        this.listContact = detail.contacts;
                    }
                }
            );
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'address', 'description']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxlength', 'pattern']},
            {'address': ['maxlength']},
            {'description': ['maxlength']},
        ]);

        this.model = this.fb.group({
            name: [this.supplier.name, [Validators.required, Validators.maxLength(256), Validators.pattern(Pattern.whiteSpace)]],
            description: [this.supplier.description, [Validators.maxLength(500)]],
            address: [this.supplier.address, [Validators.maxLength(500)]],
            isActive: [this.supplier.isActive],
            concurrencyStamp: [this.supplier.concurrencyStamp],
            contacts: this.listContact,
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            name: '',
            isActive: true,
            address: '',
            description: ''
        });
        this.listContact = [];
        this.clearFormError(this.formErrors);
    }
}
