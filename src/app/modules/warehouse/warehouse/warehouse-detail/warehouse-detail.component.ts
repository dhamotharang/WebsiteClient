import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {WarehouseDetailViewModel} from '../viewmodel/warehouse-detail.viewmodel';
import {WarehouseService} from '../service/warehouse.service';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {BaseFormComponent} from '../../../../base-form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {WarehouseLimitComponent} from '../warehouse-form/warehouse-limit/warehouse-limit.component';

@Component({
    selector: 'app-warehouse-detail',
    templateUrl: './warehouse-detail.component.html'
})

export class WarehouseDetailComponent extends BaseFormComponent implements OnInit {
    @ViewChild(WarehouseLimitComponent) warehouseLimitComponent: WarehouseLimitComponent;
    warehouseDetail: WarehouseDetailViewModel;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private router: Router,
                private route: ActivatedRoute,
                private warehouseService: WarehouseService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.WAREHOUSE_MANAGEMENT, 'Quản lý kho', 'Quản lý sản phẩm');
        this.subscribers.routerParam = this.route.params.subscribe((params: any) => {
                const id = params['id'];
                if (id) {
                    this.warehouseService.getDetail(id).subscribe((result: ActionResultViewModel<WarehouseDetailViewModel>) => {
                        this.warehouseDetail = result.data;
                    });
                }
            }
        );
    }

    getWarehouseLimit(value) {
        this.warehouseLimitComponent.search(1);
    }
}
