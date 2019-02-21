import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../base.component';
import { PromotionVoucher } from '../model/promotion-voucher.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PromotionVoucherService } from '../services/promotion-voucher.service';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { Moment } from 'moment';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { NumberValidator } from '../../../../validators/number.validator';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { UtilService } from '../../../../shareds/services/util.service';

@Component({
    selector: 'app-promotion-voucher-form',
    templateUrl: './promotion-voucher-form.component.html',
    providers: [NumberValidator, PromotionVoucherService]
})

export class PromotionVoucherFormComponent extends BaseComponent implements OnInit {
    @ViewChild('promotionGenerateVoucherForUserModal') promotionGenerateVoucherForUserModal: NhModalComponent;
    @ViewChild('promotionVoucherGenerateModal') promotionVoucherGenerateModal: NhModalComponent;
    @Input() promotionId: string;
    @Output() generateSuccess = new EventEmitter();
    @Output() updateSuccess = new EventEmitter();

    listDiscountType = [];
    voucher = new PromotionVoucher();
    model: FormGroup;
    totalVoucher: number;

    constructor(private fb: FormBuilder,
        private utilService: UtilService,
        private numberValidator: NumberValidator,
        private toastr: ToastrService,
        private spinnerService: SpinnerService,
        private promotionVoucherService: PromotionVoucherService) {
        super();
        this.listDiscountType = [{
            id: 1,
            name: '%'
        }, {
            id: 2,
            name: 'VNĐ'
        }];
    }

    ngOnInit() {
        this.buildForm();
    }

    edit(promotionVoucher: PromotionVoucher) {
        this.isUpdate = true;
        this.model.patchValue(promotionVoucher);
        this.promotionGenerateVoucherForUserModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.voucher = this.model.value;
            this.voucher.promotionId = this.promotionId;
            this.spinnerService.show();
            if (this.isUpdate) {
                this.promotionVoucherService.update(this.voucher)
                    .subscribe((result: IActionResultResponse) => {
                        this.promotionGenerateVoucherForUserModal.dismiss();
                        this.model.reset();
                        this.updateSuccess.emit(this.voucher);
                        this.voucher = new PromotionVoucher();
                        this.toastr.success('Cập nhật mã giảm giá thành công.');
                    });
            } else {
                this.promotionVoucherService.insert(this.voucher)
                    .subscribe((result: PromotionVoucher) => {
                        this.generateSuccess.emit(result);
                        this.promotionGenerateVoucherForUserModal.dismiss();
                        this.model.reset();
                        this.voucher = new PromotionVoucher();
                        this.toastr.success('Tạo mã giảm giá thành công.');
                    });
            }
        }
    }

    generateVoucher() {
        this.promotionVoucherService.inserts(this.totalVoucher, this.promotionId)
            .subscribe((result: ISearchResult<PromotionVoucher>) => {
                this.generateSuccess.emit(result);
            });
    }

    showGenerateModal() {
        this.promotionVoucherGenerateModal.open();
    }

    showVoucherFormModal() {
        this.isUpdate = false;
        this.promotionGenerateVoucherForUserModal.open();
    }

    onSelectFromDate(datetTime: Moment) {
        this.model.patchValue({ fromDate: datetTime });
    }

    onSelectToDate(dateTime: Moment) {
        this.model.patchValue({ toDate: dateTime });
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['fullName', 'phoneNumber', 'email', 'discountNumber']);
        this.validationMessages = {
            'fullName': {
                'required': 'Tên người sử dụng không được để trống.',
                'maxlength': 'Tên người sử dụng không được phép lớn hơn 50 ký tự'
            },
            'phoneNumber': {
                'required': 'Số điện thoại người sử dụng không được để trống.',
                'maxlength': 'Số điện thoại người sử dụng không được phép lớn hơn 20 ký tự'
            },
            'email': {
                'isValid': 'Email người dùng không đúng định dạng',
                'maxlength': 'Email không được vượt quá 100 ký tự'
            },
            'discountNumber': {
                'isValid': 'Mức giảm giá phải là số'
            }
        };

        this.model = this.fb.group({
            'id': [this.voucher.id],
            'fullName': [this.voucher.fullName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            'phoneNumber': [this.voucher.phoneNumber, [
                Validators.required,
                Validators.maxLength(20)
            ]],
            'email': [this.voucher.email,
            Validators.maxLength(100)],
            'discountNumber': [this.voucher.discountNumber, [
                this.numberValidator.isValid
            ]],
            'discountType': [this.voucher.discountType],
            'fromDate': [this.voucher.fromDate],
            'toDate': [this.voucher.toDate]
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }
}
