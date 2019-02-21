import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../../base-form.component';
import {BannerItem} from '../../models/banner-items.model';
import {FormBuilder, Validators} from '@angular/forms';
import {UtilService} from '../../../../shareds/services/util.service';
import {BannerService} from '../../service/banner.service';
import {IResponseResult} from '../../../../interfaces/iresponse-result';
import {NumberValidator} from '../../../../validators/number.validator';
import {finalize} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {Pattern} from '../../../../shareds/constants/pattern.const';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';

@Component({
    selector: 'app-banner-item-form',
    templateUrl: './banner-item-form.component.html',
    providers: [NumberValidator]
})

export class BannerItemFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('bannerItemFormModal') bannerItemFormModal: NhModalComponent;
    @Input() bannerId;
    @Input() isUpdate;
    @Output() onSaveSuccess = new EventEmitter();
    bannerItemId;
    bannerItem = new BannerItem();

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private numberValidator: NumberValidator,
                private bannerService: BannerService,
                private cdr: ChangeDetectorRef,
                private utilService: UtilService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    onFormModalShown() {
        this.isModified = false;
    }

    onFormModalHidden() {
        this.isUpdate = false;
    }

    add() {
        this.resetForm();
        this.utilService.focusElement('banner-item-name');
        this.isUpdate = false;
        this.bannerItemId = null;
        this.bannerItemFormModal.open();
    }

    edit(bannerItem: BannerItem) {
        this.utilService.focusElement('banner-item-name');
        this.isUpdate = true;
        this.bannerItemId = bannerItem.id;
        this.model.patchValue(bannerItem);
        this.bannerItemFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.bannerItem = this.model.value;
            this.bannerItem.id = this.bannerItemId;
            if (this.isUpdate && this.bannerItemId) {
                this.isSaving = true;
                this.bannerService.updateBannerItem(this.bannerId, this.bannerItemId, this.bannerItem)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.isModified = true;
                        this.onSaveSuccess.emit(this.bannerItem);
                        this.bannerItemFormModal.dismiss();
                    });
            } else {
                if (this.isCreateAnother) {
                    this.utilService.focusElement('banner-item-name');
                    this.onSaveSuccess.emit(this.bannerItem);
                    this.resetForm();
                } else {
                    this.resetForm();
                    this.onSaveSuccess.emit(this.bannerItem);
                    this.bannerItemFormModal.dismiss();
                }
            }
        }
    }

    closeModal() {
        this.bannerItemFormModal.dismiss();
    }

    selectImage(value: ExplorerItem) {
        if (value.isImage) {
            this.model.patchValue({
                name: value.name,
                url: '',
                image: value.absoluteUrl,
                alt: value.name,
            });
        } else {
            this.toastr.error('Please select image');
        }
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'url', 'image',
            'order', 'alt', 'description']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {name: ['maxLength']},
            {url: ['required', 'maxLength', 'pattern']},
            {image: ['required', 'maxLength']},
            {order: ['isValid', 'lessThan', 'greaterThan']},
            {alt: ['maxLength']},
            {description: ['maxLength']},
        ]);

        this.model = this.fb.group({
            name: [this.bannerItem.name,
                [Validators.maxLength(256)]],
            url: [this.bannerItem.url, [
                Validators.required,
                Validators.maxLength(500),
                Validators.pattern(Pattern.url)
            ]],
            image: [this.bannerItem.image, [Validators.required, Validators.maxLength(500)]],
            order: [this.bannerItem.order, [this.numberValidator.isValid, this.numberValidator.lessThan(10000),
                this.numberValidator.greaterThan(-1)]],
            alt: [this.bannerItem.alt, [Validators.maxLength(256)]],
            description: [this.bannerItem.description, [Validators.maxLength(4000)]],
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue(new BannerItem());
        this.clearFormError(this.formErrors);
    }
}
