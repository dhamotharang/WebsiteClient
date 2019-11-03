import {AfterViewInit, Component, Inject, OnInit, QueryList, ViewChild} from '@angular/core';
import {TinymceComponent} from '../../../../shareds/components/tinymce/tinymce.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductTranslation} from '../../../product/product/model/product-translation.model';
import {Product} from '../../../product/product/model/product.model';
import {UtilService} from '../../../../shareds/services/util.service';
import {ToastrService} from 'ngx-toastr';
import {NumberValidator} from '../../../../validators/number.validator';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {Pattern} from '../../../../shareds/constants/pattern.const';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {environment} from '../../../../../environments/environment';
import {ProductDetailViewModel} from '../../../product/product/viewmodel/product-detail.viewmodel';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {Agency, AgencyTransaction} from '../model/agency.model';
import {BaseFormComponent} from '../../../../base-form.component';
import {AgencyService} from '../agency-service';

@Component({
    selector: 'app-agency-form',
    templateUrl: './agency-form.component.html',
    styleUrls: ['./agency-form.component.css']
})

export class AgencyFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('agencyFormModal') agencyFormModal: NhModalComponent;
    agency = new Agency();
    modelTranslation = new AgencyTransaction();

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private numberValidator: NumberValidator,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private route: ActivatedRoute,
                private router: Router,
                private agencyService: AgencyService) {
        super();
    }

    ngOnInit(): void {
        this.renderForm();
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

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['email', 'phoneNumber', 'website', 'idCard', 'idCardDate',
            'provinceId', 'districtId', 'length', 'width', 'height', 'totalArea',
        'startTime', 'googleMap', 'order', 'isShow', 'isActive']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'email': ['maxLength', 'pattern']},
            {'phoneNumber': ['required', 'maxLength']},
            {'website': ['maxLength']},
            {'idCard': ['maxLength']},
            {'isManagementByLot': ['required']},
            {'isActive': ['required']},
            {'salePrice': ['required', 'isValid']},
            {'id': ['maxLength', 'pattern']},
            {'unitId': ['required', 'maxLength']},
            {'thumbnail': ['maxLength']},
            {'categories': ['required']},
            {'isManagementByLot': ['required']},
            {'isActive': ['required']},
            {'salePrice': ['required', 'isValid']},
            {'isActive': ['required']},
            {'salePrice': ['required', 'isValid']},
        ]);

        this.model = this.fb.group({
            unitName: [this.product.unitName],
            salePrice: [this.product.salePrice, [Validators.required, this.numberValidator.isValid]],
            thumbnail: [this.product.thumbnail, [Validators.maxLength(500)]],
            isManagementByLot: [this.product.isManagementByLot, [Validators.required]],
            isActive: [this.product.isActive, [Validators.required]],
            isHomePage: [this.product.isHomePage],
            isHot: [this.product.isHot],
            categories: [this.categories, [Validators.required]],
            images: [this.productImages],
            concurrencyStamp: [this.product.concurrencyStamp],
            translations: this.fb.array([]),
            conversionUnits: this.fb.array([]),
            attributes: this.fb.array([])
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
            {address: ['maxlength']},
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
            address: [this.modelTranslation.address, [Validators.maxLength(1000)]],
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
                name: '',
                description: '',
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private getDetail(productId: string) {
        this.productFormModal.open();
        this.subscribers.getDetail = this.productService.getDetail(productId)
            .subscribe((result: ProductDetailViewModel) => {
                this.model.patchValue({
                    id: productId,
                    categories: result.categories.map((category: any) => category.categoryId),
                    unitId: result.unitId,
                    unitName: result.unitName,
                    isActive: result.isActive,
                    isManagementByLot: result.isManagementByLot,
                    salePrice: result.salePrice,
                    translations: result.translations,
                    concurrencyStamp: result.concurrencyStamp,
                    thumbnail: result.thumbnail,
                    images: result.images,
                    isHot: result.isHot,
                    isHomePage: result.isHomePage
                });

                if (result.translations && result.translations.length > 0) {
                    this.translations.controls.forEach(
                        (model: FormGroup) => {
                            const detail = _.find(
                                result.translations,
                                (newTranslation: ProductTranslation) => {
                                    return (
                                        newTranslation.languageId === model.value.languageId
                                    );
                                }
                            );
                            detail.content = detail.content.replace(new RegExp('"uploads/', 'g'), '"' + environment.fileUrl + 'uploads/');
                            if (detail) {
                                model.patchValue(detail);

                                this.eventContentEditors.forEach((contentEditor: TinymceComponent) => {
                                    const editorId = `productContent${this.currentLanguage}`;
                                    if (contentEditor.elementId === editorId) {
                                        contentEditor.setContent(detail.content);
                                    }
                                });

                            }
                        }
                    );
                }
                setTimeout(() => {
                    this.addConversionUnit();
                    this.addAttribute();
                });
            });
    }
}
