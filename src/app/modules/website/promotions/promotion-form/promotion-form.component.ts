import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Promotion } from '../model/promotion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { Title } from '@angular/platform-browser';
import { PromotionVoucherListComponent } from '../promotion-voucher-list.component/promotion-voucher-list.component';
import { PromotionSubjectListComponent } from '../promotion-subject-list/promotion-subject-list.component';
import { PromotionService } from '../services/promotion.service';
import { UtilService } from '../../../../shareds/services/util.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { NhWizardComponent } from '../../../../shareds/components/nh-wizard/nh-wizard.component';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { finalize } from 'rxjs/operators';
import { BaseFormComponent } from '../../../../base-form.component';

@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: './promotion-form.component.html',
    providers: [UtilService, PromotionService]
})

export class PromotionFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('promotionSubjectVoucher') promotionSubjectVoucher: NhModalComponent;
    @ViewChild('promotionSubjectFormModal') promotionSubjectFormModal: NhModalComponent;
    @ViewChild('promotionGenerateVoucherModal') promotionGenerateVoucherModal: NhModalComponent;
    @ViewChild('promotionGenerateVoucherForUserModal') promotionGenerateVoucherForUserModal: NhModalComponent;
    @ViewChild(PromotionVoucherListComponent) promotionVoucherListComponent: PromotionVoucherListComponent;
    @ViewChild(PromotionSubjectListComponent) promotionSubjectListComponent: PromotionSubjectListComponent;
    @ViewChild(NhWizardComponent) promotionFormWizard: NhWizardComponent;
    promotion = new Promotion();
    promotionModel: FormGroup;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private title: Title,
                private fb: FormBuilder,
                private router: Router,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private utilService: UtilService,
                private promotionService: PromotionService) {
        super();
        // this.getPermission(this.appService);
    }

    ngOnInit() {
        console.log('promotion form');
        this.buildPromotionForm();
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            if (params.id) {
                this.isUpdate = true;
                this.promotionSubjectListComponent.isUpdate = true;
                this.spinnerService.show();
                this.promotionService.getDetail(params.id)
                    .subscribe((result: Promotion) => {
                        if (result) {
                            this.promotionModel.patchValue(result);
                        }
                    });
            }
        });
    }

    ngAfterViewInit() {
        const title = this.isUpdate ? 'Cập nhật thông tin chương trình khuyến mại.' : 'Thêm mới chương trình khuyến mại';
        this.title.setTitle(title);
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.WEBSITE_PROMOTION, 'Quản lý khuyên mại',
            title);
    }

    selectedDate(value: any) {
        this.promotionModel.patchValue({
            fromDate: value.start,
            toDate: value.end
        });
    }

    savePromotion() {
        const isValid = this.utilService.onValueChanged(this.promotionModel, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.promotion = this.promotionModel.value;
            this.spinnerService.show();
            if (this.isUpdate) {
                this.promotionService.update(this.promotion)
                    .pipe(finalize(() => this.spinnerService.hide()))
                    .subscribe((result: IActionResultResponse) => {
                        this.toastr.success(result.message);
                        this.promotionFormWizard.next();
                        this.promotionSubjectListComponent.search();
                    }, (response) => {
                        if (response.error.code === 0) {
                            this.promotionFormWizard.next();
                            this.promotionSubjectListComponent.search();
                        }
                    });
            } else {
                this.promotionService.insert(this.promotion)
                    .subscribe((result: { id: string }) => {
                        if (result) {
                            this.promotionModel.patchValue({id: result.id});
                            this.promotion.id = result.id;
                            this.promotionFormWizard.next();
                        }
                    });
            }
        }
    }

    savePromotionSubject() {
        this.promotionSubjectListComponent.savePromotionSubject();
    }

    onSubjectSaveSuccess() {
        this.promotionFormWizard.next();
        if (this.isUpdate) {
            this.promotionVoucherListComponent.search(1);
        }
    }

    finishCreatePromotion() {
        this.router.navigate(['/website/promotion']);
    }

    private buildPromotionForm() {
        this.formErrors = this.utilService.renderFormError(['name']);
        this.validationMessages = {
            'name': {
                'required': 'Vui lòng nhập tên chương trình khuyến mại',
                'maxLength': 'Tên chương trình khuyến mại không được vượt quá 500 ký tự'
            }
        };
        this.promotionModel = this.fb.group({
            'id': [this.promotion.id],
            'name': [this.promotion.name, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            'fromDate': [this.promotion.fromDate],
            'toDate': [this.promotion.toDate],
            'isActive': [this.promotion.isActive],
            'description': [this.promotion.description]
        });
        this.promotionModel.valueChanges.subscribe(() => this.utilService.onValueChanged(this.promotionModel,
            this.formErrors, this.validationMessages));
    }
}
