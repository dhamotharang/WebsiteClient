import { Component, Inject, Input, ViewChild } from '@angular/core';
import { PromotionVoucher } from '../model/promotion-voucher.model';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { IAppConfig } from '../../../../interfaces/iapp-config';
import { PromotionVoucherFormComponent } from '../promotion-voucher-form/promotion-voucher-form.component';
import { PromotionVoucherService } from '../services/promotion-voucher.service';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { BaseListComponent } from '../../../../base-list.component';
import { APP_CONFIG } from '../../../../configs/app.config';

@Component({
    selector: 'app-promotion-voucher-list',
    templateUrl: './promotion-voucher-list.component.html',
    providers: [PromotionVoucherService]
})

export class PromotionVoucherListComponent extends BaseListComponent<PromotionVoucher> {
    @Input() promotionId: string;
    @Input() isReadOnly = false;
    @ViewChild(PromotionVoucherFormComponent) promotionVoucherFormComponent: PromotionVoucherFormComponent;
    subscribers: any = {};

    listPromotionVoucher: PromotionVoucher[] = [];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private promotionVoucherService: PromotionVoucherService) {
        super();
        this.pageSize = this.appConfig.pageSize;
        // this.getPermission(this.appService);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.spinnerService.show();
        this.subscribers.searchVoucher = this.promotionVoucherService.search(this.keyword, this.promotionId,
            this.currentPage, this.pageSize)
            .subscribe((result: ISearchResult<PromotionVoucher>) => {
                this.listPromotionVoucher = result.items;
                this.totalRows = result.totalRows;
            });
    }

    onGenerateVoucherSuccess(vouchers: PromotionVoucher[] | PromotionVoucher) {
        console.log(vouchers);
        if (vouchers instanceof Array) {
            this.listPromotionVoucher = vouchers;
        } else {
            this.listPromotionVoucher = [...this.listPromotionVoucher, vouchers];
        }
    }

    onUpdateVoucherSuccess(voucher: PromotionVoucher) {
        const existingVoucher = _.find(this.listPromotionVoucher, (promotionVoucher: PromotionVoucher) => {
            return promotionVoucher.id === voucher.id;
        });

        if (existingVoucher) {
            existingVoucher.fullName = voucher.fullName;
            existingVoucher.phoneNumber = voucher.phoneNumber;
            existingVoucher.email = voucher.email;
            existingVoucher.discountNumber = voucher.discountNumber;
            existingVoucher.discountType = voucher.discountType;
            existingVoucher.fromDate = voucher.fromDate;
            existingVoucher.toDate = voucher.toDate;
        }
    }

    showGenerate() {
        this.promotionVoucherFormComponent.showGenerateModal();
    }

    showAddVoucher() {
        this.promotionVoucherFormComponent.showVoucherFormModal();
    }

    edit(promotionVoucher: PromotionVoucher) {
        this.promotionVoucherFormComponent.edit(promotionVoucher);
    }

    delete(promotionVoucher: PromotionVoucher) {
        // swal({
        //     title: 'Xóa mã giảm giá',
        //     text: `Bạn có chắc chắn muốn xóa mã giảm giá: "${promotionVoucher.code}" không?`,
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'Đồng ý',
        //     cancelButtonText: 'Hủy bỏ'
        // }).then(() => {
        //     this.spinnerService.open();
        //     this.promotionVoucherService.delete(promotionVoucher.id)
        //         .finally(() => this.spinnerService.hide())
        //         .subscribe((result: IActionResultResponse) => {
        //             this.toastr.success(result.message);
        //             this.search(this.currentPage);
        //         });
        // }, () => {
        // });
    }
}
