import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Promotion } from '../model/promotion.model';
import { PromotionService } from '../services/promotion.service';
import { IAppConfig } from '../../../../interfaces/iapp-config';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { BaseListComponent } from '../../../../base-list.component';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import swal from 'sweetalert2';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { PromotionVoucherFormComponent } from '../promotion-voucher-form/promotion-voucher-form.component';
import { APP_CONFIG } from '../../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';

@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: './promotion-list.component.html',
    providers: [PromotionService]
})

export class PromotionListComponent extends BaseListComponent<Promotion> implements OnInit {
    @ViewChild('promotionVoucherFormComponent') promotionVoucherFormComponent: PromotionVoucherFormComponent;
    fromDate?: any;
    toDate?: any;
    promotionId: string;

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private title: Title,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private promotionService: PromotionService) {
        super();
        this.title.setTitle('Danh sách các chương trình khuyến mại.');

    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.WEBSITE_PROMOTION,
            'Quản lý khuyến mại', 'Danh sách các chương trình khuyến mại.');
        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.spinnerService.show();
        this.promotionService.search(this.keyword, this.fromDate, this.toDate, this.currentPage, this.pageSize)
            .subscribe((result: ISearchResult<Promotion>) => {
                this.listItems = result.items;
                this.totalRows = result.totalRows;
            });
    }

    getLinkCopied() {
        this.toastr.success('Get link thành công.');
    }

    showAddNewVoucherModal(promotionId: string) {
        this.promotionId = promotionId;
        this.promotionVoucherFormComponent.showVoucherFormModal();
    }

    delete(promotion: Promotion) {
        this.spinnerService.show();
        this.promotionService.delete(promotion.id)
            .subscribe((result: IActionResultResponse) => {
                if (result.code === -1) {
                    swal({
                        title: ``,
                        text: `${result.message}. Bạn có muốn tiếp tục xóa không?`,
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Đồng ý',
                        cancelButtonText: 'Hủy bỏ'
                    }).then(() => {
                        this.spinnerService.show();
                        this.promotionService.delete(promotion.id, true)
                            .subscribe((resultConfirm: IActionResultResponse) => {
                                this.toastr.success(resultConfirm.message);
                                this.search(this.currentPage);
                            });
                    }, () => {
                    });
                } else {
                    this.toastr.success(result.message);
                    this.search(this.currentPage);
                }
            });
    }
}
