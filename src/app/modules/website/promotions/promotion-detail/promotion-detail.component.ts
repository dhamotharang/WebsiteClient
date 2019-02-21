import { AfterViewInit, Component, Inject, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Promotion } from '../model/promotion.model';
import { PromotionService } from '../services/promotion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { Title } from '@angular/platform-browser';
import { PromotionSubjectService } from '../services/promotion-subject.service';
import { BaseListComponent } from '../../../../base-list.component';
import { PromotionVoucherListComponent } from '../promotion-voucher-list.component/promotion-voucher-list.component';
import { PromotionSubjectListComponent } from '../promotion-subject-list/promotion-subject-list.component';
import { UtilService } from '../../../../shareds/services/util.service';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';

@Component({
    selector: 'app-promotion-detail',
    templateUrl: './promotion-detail.component.html',
    providers: [UtilService, PromotionService, PromotionSubjectService]
})

export class PromotionDetailComponent extends BaseListComponent<Promotion> implements AfterViewInit {
    @ViewChild('promotionVoucherList') promotionVoucherListComponent: PromotionVoucherListComponent;
    @ViewChild(PromotionSubjectListComponent) promotionSubjectListComponent: PromotionSubjectListComponent;
    @Input() promotionId: string;

    promotion = new Promotion();

    constructor(
        @Inject(APP_CONFIG) public appConfig: IAppConfig,
        @Inject(PAGE_ID) public pageId: IPageId,
        private route: ActivatedRoute,
        private title: Title,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private spinnerService: SpinnerService,
        private utilService: UtilService,
        private promotionService: PromotionService,
        private promotionSubjectService: PromotionSubjectService) {
        super();
        // this.getPermission(this.appService);

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.promotionId = params.id;
            if (this.promotionId) {
                this.spinnerService.show();
                this.promotionService.getDetail(this.promotionId)
                    .subscribe((result: Promotion) => {
                        this.promotion = result;
                    });
            }
        });
    }

    ngAfterViewInit() {
        const title = 'Chi tiết chương trình khuyến mại.';
        this.title.setTitle(title);
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.WEBSITE_PROMOTION, 'Quản lý khuyên mại',
            title);

        this.promotionVoucherListComponent.search(1);
        this.promotionSubjectListComponent.search();
    }

    getListService() {

    }

    getListVoucher() {

    }
}
