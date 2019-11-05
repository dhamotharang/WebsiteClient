import {AfterViewInit, Component, Inject, OnInit, QueryList, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../../product/product/model/product.model';
import {UtilService} from '../../../../shareds/services/util.service';
import {ToastrService} from 'ngx-toastr';
import {NumberValidator} from '../../../../validators/number.validator';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {Pattern} from '../../../../shareds/constants/pattern.const';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {Agency, AgencyTransaction} from '../model/agency.model';
import {BaseFormComponent} from '../../../../base-form.component';
import {AgencyService} from '../agency-service';
import {AgencyDetailViewModel} from '../model/agency-detail.viewmodel';
import {ISearchResult} from '../../../../interfaces/isearch.result';
import {NationalService} from '../../../customer/service/national.service';
import {DateTimeValidator} from '../../../../validators/datetime.validator';

@Component({
    selector: 'app-agency-form',
    templateUrl: './agency-form.component.html',
    styleUrls: ['./agency-form.component.css'],
    providers: [NumberValidator, NationalService, DateTimeValidator]
})

export class AgencyFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('agencyFormModal') agencyFormModal: NhModalComponent;
    agency = new Agency();
    modelTranslation = new AgencyTransaction();
    listProvince = [];
    listDistrict = [];
    enableSelectDistrict = false;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private numberValidator: NumberValidator,
                private datetimeValidator: DateTimeValidator,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private route: ActivatedRoute,
                private router: Router,
                private nationalService: NationalService,
                private agencyService: AgencyService) {
        super();
    }

    ngOnInit(): void {
        this.renderForm();
        this.nationalService.getProvinceByNational(1).subscribe((result: ISearchResult<any>) => {
            this.listProvince = result.items;
        });
    }

    ngAfterViewInit() {
    }

    onModalShown() {
        this.isModified = false;
    }

    onModalHidden() {
        this.resetForm();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    add() {
        this.agencyFormModal.open();
    }

    edit(agencyId: string) {
        this.id = agencyId;
        this.isUpdate = true;
        this.getDetail(agencyId);
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );
        const isLanguageValid = this.validateLanguage();
        if (isValid && isLanguageValid) {

            this.isSaving = true;
            if (this.isUpdate) {
                this.agencyService
                    .update(this.id, this.agency)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.agencyFormModal.dismiss();
                        // this.router.navigate(['/products']);
                    });
            } else {
                debugger;
                this.agencyService
                    .insert(this.agency)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe((result: ActionResultViewModel) => {
                        this.id = result.data;
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('name ' + this.currentLanguage);
                            this.resetForm();
                        } else {
                            this.agencyFormModal.dismiss();
                        }
                    });
            }
        }
    }

    onProvinceSelect(province) {
        this.enableSelectDistrict = true;
        this.model.patchValue({provinceId: province.id, provinceName: province.name});
        this.getDistrictByProvinceId(province.id);
    }

    onDistrictSelect(district) {
        this.model.patchValue({districtId: district.id, districtName: district.name});
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['email', 'phoneNumber', 'website', 'idCard', 'idCardDate',
            'provinceId', 'districtId', 'length', 'width', 'height', 'totalArea',
            'startTime', 'googleMap', 'order', 'isShow', 'isActive', 'website']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'email': ['maxLength', 'pattern']},
            {'phoneNumber': ['required', 'maxLength', 'pattern']},
            {'website': ['maxLength', 'pattern']},
            {'idCard': ['maxLength']},
            {'idCardDate': ['isValid']},
            {'provinceId': ['required', 'isValid']},
            {'districtId': ['required', 'isValid']},
            {'length': ['isValid']},
            {'width': ['isValid']},
            {'height': ['isValid']},
            {'totalArea': ['isValid']},
            {'startTime': ['isValid']},
            {'googleMap': ['maxLength']},
            {'order': ['isValid']},
            {'isShow': ['required']},
            {'isActive': ['required']},
            {'website': ['maxLength']}
        ]);

        this.model = this.fb.group({
            email: [this.agency.email, [Validators.maxLength(50), Validators.pattern(Pattern.email)]],
            phoneNumber: [this.agency.phoneNumber, [Validators.required, Validators.maxLength(50), Validators.pattern(Pattern.phoneNumber)]],
            website: [this.agency.website, [Validators.maxLength(500), Validators.pattern(Pattern.url)]],
            idCard: [this.agency.idCard, [Validators.maxLength(50)]],
            idCardDate: [this.agency.idCardDate, [this.datetimeValidator.isValid]],
            provinceId: [this.agency.provinceId, [Validators.required, this.numberValidator.isValid]],
            provinceName: [this.agency.provinceName],
            districtId: [this.agency.districtId, [Validators.required, this.numberValidator.isValid]],
            districtName: [this.agency.districtName],
            length: [this.agency.length, [this.numberValidator.isValid]],
            width: [this.agency.width, [this.numberValidator.isValid]],
            height: [this.agency.height, [this.numberValidator.isValid]],
            totalArea: [this.agency.totalArea, [this.numberValidator.isValid]],
            startTime: [this.agency.startTime, [this.datetimeValidator.isValid]],
            googleMap: [this.agency.googleMap, [Validators.maxLength(500)]],
            order: [this.agency.order, [this.numberValidator.isValid]],
            isShow: [this.agency.isShow, [Validators.required]],
            isActive: [this.agency.isActive, [Validators.required]],
            translations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['fullName', 'agencyName', 'idCardAddress', 'address', 'addressRegistered']
        );
        this.translationValidationMessage[
            language
            ] = this.utilService.renderFormErrorMessage([
            {fullName: ['required', 'maxlength', 'pattern']},
            {agencyName: ['required', 'maxlength', 'pattern']},
            {idCardAddress: ['maxlength']},
            {address: ['required', 'maxlength']},
            {addressRegistered: ['maxlength']},
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            fullName: [
                this.modelTranslation.fullName,
                [Validators.required, Validators.maxLength(256), Validators.pattern(Pattern.whiteSpace)]
            ],
            agencyName: [
                this.modelTranslation.agencyName,
                [Validators.required, Validators.maxLength(256), Validators.pattern(Pattern.whiteSpace)]
            ],
            idCardAddress: [
                this.modelTranslation.idCardAddress,
                [Validators.maxLength(500)]
            ],
            address: [this.modelTranslation.address, [Validators.required, Validators.maxLength(1000)]],
            addressRegistered: [this.modelTranslation.addressRegistered, [Validators.maxLength(1000)]],
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslation(false)
        );
        return translationModel;
    };

    private resetForm() {
        this.id = null;
        this.model.patchValue(new Product());
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                fullName: '',
                description: '',
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private getDetail(agencyId: string) {
        this.agencyFormModal.open();
        this.subscribers.getDetail = this.agencyService.getDetail(agencyId)
            .subscribe((result: ActionResultViewModel<AgencyDetailViewModel>) => {
                // this.model.patchValue({
                //     id: productId,
                //     categories: result.categories.map((category: any) => category.categoryId),
                //     unitId: result.unitId,
                //     unitName: result.unitName,
                //     isActive: result.isActive,
                //     isManagementByLot: result.isManagementByLot,
                //     salePrice: result.salePrice,
                //     translations: result.translations,
                //     concurrencyStamp: result.concurrencyStamp,
                //     thumbnail: result.thumbnail,
                //     images: result.images,
                //     isHot: result.isHot,
                //     isHomePage: result.isHomePage
                // });
                //
                // if (result.translations && result.translations.length > 0) {
                //     this.translations.controls.forEach(
                //         (model: FormGroup) => {
                //             const detail = _.find(
                //                 result.translations,
                //                 (newTranslation: ProductTranslation) => {
                //                     return (
                //                         newTranslation.languageId === model.value.languageId
                //                     );
                //                 }
                //             );
                //             detail.content = detail.content.replace(new RegExp('"uploads/', 'g'), '"' + environment.fileUrl + 'uploads/');
                //             if (detail) {
                //                 model.patchValue(detail);
                //
                //                 this.eventContentEditors.forEach((contentEditor: TinymceComponent) => {
                //                     const editorId = `productContent${this.currentLanguage}`;
                //                     if (contentEditor.elementId === editorId) {
                //                         contentEditor.setContent(detail.content);
                //                     }
                //                 });
                //
                //             }
                //         }
                //     );
                // }
                // setTimeout(() => {
                //     this.addConversionUnit();
                //     this.addAttribute();
                // });
            });
    }

    private getDistrictByProvinceId(provinceId: number) {
        this.nationalService.getDistrictByProvinceId(provinceId).subscribe((result: ISearchResult<any>) => {
            this.enableSelectDistrict = true;
            this.listDistrict = result.items;
        });
    }
}
