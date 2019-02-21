import { Component, OnInit, AfterViewInit, Inject, ViewChild } from '@angular/core';
import { LaborContractListComponent } from './labor-contract-list.component';
import { ILaborContractStatistics } from '../../../../interfaces/ilabor-contract-statistics';
import { ActivatedRoute } from '@angular/router';
import { LaborContractService } from './labor-contract.service';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { BaseListComponent } from '../../../../base-list.component';
import { LaborContract } from './labor-contract.model';

@Component({
    selector: 'labor-contract-detail',
    template: `
        <div class="row">
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div class="dashboard-stat blue">
                    <div class="visual">
                        <i class="fa fa-comments"></i>
                    </div>
                    <div class="details">
                        <div class="number">
                            <span data-counter="counterup">{{totalLabor}}</span>
                        </div>
                        <div class="desc"> Tất cả</div>
                    </div>
                    <a class="more" href="javascript:;" (click)="viewAll()"> Xem tất cả
                        <i class="m-icon-swapright m-icon-white"></i>
                    </a>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div class="dashboard-stat red">
                    <div class="visual">
                        <i class="fa fa-bar-chart-o"></i>
                    </div>
                    <div class="details">
                        <div class="number">
                            <span data-counter="counterup">{{inUse}}</span></div>
                        <div class="desc"> Đang sử dụng</div>
                    </div>
                    <a class="more" href="javascript:;" (click)="viewInUse()"> Xem tất cả
                        <i class="m-icon-swapright m-icon-white"></i>
                    </a>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div class="dashboard-stat green">
                    <div class="visual">
                        <i class="fa fa-shopping-cart"></i>
                    </div>
                    <div class="details">
                        <div class="number">
                            <span data-counter="counterup">{{expiresInThisMonth}}</span>
                        </div>
                        <div class="desc"> Hết hạn trong tháng</div>
                    </div>
                    <a class="more" href="javascript:;" (click)="viewExpiresInThisMonth()"> Xem tất cả
                        <i class="m-icon-swapright m-icon-white"></i>
                    </a>
                </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                <div class="dashboard-stat purple">
                    <div class="visual">
                        <i class="fa fa-globe"></i>
                    </div>
                    <div class="details">
                        <div class="number">
                            <span data-counter="counterup">{{expiresInNextMonth}}</span></div>
                        <div class="desc"> Hết hạn tháng sau</div>
                    </div>
                    <a class="more" href="javascript:;" (click)="viewExpiresInNextMonth()"> Xem tất cả
                        <i class="m-icon-swapright m-icon-white"></i>
                    </a>
                </div>
            </div>
        </div>
        <!-- TODO: Check this -->
        <!--<user-labor-contract-list [allowAdd]="false"></user-labor-contract-list>-->
    `,
    providers: [LaborContractService]
})

export class LaborContractComponent extends BaseListComponent<LaborContract> implements OnInit, AfterViewInit {
    @ViewChild(LaborContractListComponent) laborContractList: LaborContractListComponent;
    totalLabor: number;
    inUse: number;
    expiresInThisMonth: number;
    expiresInNextMonth: number;
    pageTitle = 'Danh sách hợp đồng';

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private laborContractService: LaborContractService) {
        super();
        this.laborContractService.getStatistics().subscribe((result: ILaborContractStatistics) => {
            this.totalLabor = result.total;
            this.inUse = result.inUse;
            this.expiresInNextMonth = result.expiresInNextMonth;
            this.expiresInThisMonth = result.expiresInThisMonth;
        });
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.HR, this.pageId.LABOR_CONTRACT, 'Quản lý hợp đồng', this.pageTitle);
        this.laborContractList.getAllContractTypes();
        this.laborContractList.search(1);
    }

    ngAfterViewInit(): void {
    }

    viewAll() {
        // this.appService.pageTitle$.next('Danh sách hợp đồng');
        this.laborContractList.isUse = false;
        this.laborContractList.isSearchExpires = false;
        this.laborContractList.search(1);
    }

    viewInUse() {
        // this.appService.pageTitle$.next('Danh sách hợp đồng đang được sử dụng');
        this.laborContractList.isSearchExpires = false;
        this.laborContractList.isUse = true;
        this.laborContractList.search(1);
    }

    viewExpiresInThisMonth() {
        // this.appService.pageTitle$.next('Danh sách hợp đồng hết hạn trong tháng này');
        this.laborContractList.isNext = false;
        this.laborContractList.isSearchExpires = true;
        this.laborContractList.search(1);
    }

    viewExpiresInNextMonth() {
        // this.appService.pageTitle$.next('Danh sách hợp đồng hết hạn trong tháng sau');
        this.laborContractList.isNext = true;
        this.laborContractList.isSearchExpires = true;
        this.laborContractList.search(1);
    }
}
