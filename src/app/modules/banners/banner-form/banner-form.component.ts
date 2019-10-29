import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../base-form.component';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {FormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {UtilService} from '../../../shareds/services/util.service';
import {finalize} from 'rxjs/operators';
import {IResponseResult} from '../../../interfaces/iresponse-result';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {Banner, BannerType, DisplayType, EffectType} from '../models/banner.model';
import {BannerItem} from '../models/banner-items.model';
import {BannerService} from '../service/banner.service';
import {BannerDetailViewModel} from '../viewmodel/banner-detail.viewmodel';
import {NumberValidator} from '../../../validators/number.validator';
import * as _ from 'lodash';
import {Positions} from '../../../shareds/constants/position.const';

@Component({
    selector: 'app-banner-form',
    templateUrl: './banner-form.component.html',
    providers: [NumberValidator, BannerService]
})

export class BannerFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('bannerFormModal') bannerFormModal: NhModalComponent;
    @Output() onSaveSuccess = new EventEmitter();
    banner = new Banner();
    listBannerItem: BannerItem[] = [];
    bannerId;
    bannerTypes = [
        {
            id: BannerType.normal,
            name: 'Normal'
        }, {
            id: BannerType.advertising,
            name: 'Advertising'
        }];

    displayTypes = [
        {
            id: DisplayType.static,
            name: 'Static'
        }, {
            id: DisplayType.slide,
            name: 'Slide'
        }
    ];

    effectTypes = [{
        id: EffectType.fade,
        name: 'Fade'
    }, {
        id: EffectType.slideDown,
        name: 'slideDown'
    }, {
        id: EffectType.slideLeft,
        name: 'SlideLeft'
    }, {
        id: EffectType.slideRight,
        name: 'SlideRight'
    }, {
        id: EffectType.slideUp,
        name: 'SlideUp'
    }, {
        id: EffectType.bounce,
        name: 'Bounce'
    }, {
        id: EffectType.slip,
        name: 'Slip'
    }, {
        id: EffectType.lightSpeed,
        name: 'lightSpeed'
    }, {
        id: EffectType.rotate,
        name: 'rotate'
    }, {
        id: EffectType.zoom,
        name: 'zoom'
    }, {
        id: EffectType.bounce,
        name: 'roll'
    }];

    positions = [{
        id: Positions.top,
        name: 'Top'
    }, {
        id: Positions.right,
        name: 'Right'
    }, {
        id: Positions.bottom,
        name: 'Bottom'
    }, {
        id: Positions.left,
        name: 'Left'
    }, {
        id: Positions.middle,
        name: 'Middle'
    }];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private numberValidator: NumberValidator,
                private bannerService: BannerService,
                private cdr: ChangeDetectorRef,
                private utilService: UtilService) {
        super();
    }

    ngOnInit() {
        this.banner = new Banner();
        this.renderForm();
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    onFormModalShown() {
        this.isModified = false;
    }

    onFormModalHidden() {
        this.isUpdate = false;
        if (this.isModified) {
            this.onSaveSuccess.emit();
        }
    }

    add() {
        this.resetForm();
        this.utilService.focusElement('name');
        this.isUpdate = false;
        this.bannerFormModal.open();
    }

    edit(id: string) {
        this.utilService.focusElement('name');
        this.isUpdate = true;
        this.bannerId = id;
        this.getDetail(id);
        this.bannerFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.banner = this.model.value;
            this.banner.bannerItems = _.filter(this.listBannerItem, (bannerItem: BannerItem) => {
                return bannerItem.image !== '' && bannerItem.image !== null;
            });

            if (!this.banner.bannerItems || this.banner.bannerItems.length === 0) {
                return this.toastr.error('Please insert banner item');
            }
            this.isSaving = true;
            if (this.isUpdate) {
                this.bannerService.update(this.bannerId, this.banner)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.isModified = true;
                        this.bannerFormModal.dismiss();
                    });
            } else {
                this.bannerService.insert(this.banner)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('name');
                            this.resetForm();
                        } else {
                            this.resetForm();
                            this.bannerFormModal.dismiss();
                        }
                    });
            }
        }
    }

    getDetail(id: string) {
        this.bannerService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<BannerDetailViewModel>) => {
                    const bannerDetail = result.data;
                    if (bannerDetail) {
                        this.model.patchValue(bannerDetail);
                        this.listBannerItem = bannerDetail.bannerItems;
                        console.log(bannerDetail, this.model.value);
                    }
                }
            );
    }

    closeModal() {
        this.bannerFormModal.dismiss();
    }

    selectBannerItem(value) {
        if (value) {
            this.listBannerItem = value;
        }
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'type', 'description',
            'displayType', 'effectType', 'isActive', 'position', 'isPopUp']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxLength']},
            {type: ['required', 'isValid']},
            {displayType: ['required', 'isValid']},
            {effectType: ['required', 'isValid']},
            {position: ['required', 'isValid']},
            {isActive: ['isValid']},
            {isPopup: ['isValid']},
            {description: ['maxLength']},
        ]);

        this.model = this.fb.group({
            name: [this.banner.name,
                [Validators.required,
                    Validators.maxLength(256)]],
            type: [this.banner.type, [
                Validators.required,
                this.numberValidator.isValid
            ]],
            isActive: [this.banner.isActive],
            isPopup: [this.banner.isPopup],
            displayType: [this.banner.displayType, [Validators.required, this.numberValidator.isValid]],
            effectType: [this.banner.effectType, [Validators.required, this.numberValidator.isValid]],
            position: [this.banner.position, [Validators.required, this.numberValidator.isValid]],
            description: [this.banner.description, [Validators.maxLength]],
            concurrencyStamp: [this.banner.concurrencyStamp],
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            id: null,
            name: '',
            type: BannerType.normal,
            isActive: true,
            isPopup: false,
            description: '',
            displayType: DisplayType.slide,
            effectType: EffectType.fade,
            concurrencyStamp: '',
            bannerItems: [],
        });

        this.listBannerItem = [];
        this.clearFormError(this.formErrors);
    }
}
