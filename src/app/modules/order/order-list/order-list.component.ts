import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../base-list.component';
import {OrderSearchViewModel} from '../viewmodel/order.viewmodel';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {ActivatedRoute, Router} from '@angular/router';
import {HelperService} from '../../../shareds/services/helper.service';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {Location} from '@angular/common';
import {UtilService} from '../../../shareds/services/util.service';
import {OrderStatus} from '../const/order-status.const';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {finalize} from 'rxjs/operators';
import {OrderService} from '../service/order.service';
import {FilterLink} from '../../../shareds/models/filter-link.model';
import {NhSuggestion} from '../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {OrderDetailViewModel} from '../viewmodel/order-detail.viewmodel';
import * as _ from 'lodash';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {ProductResultViewModel} from '../../product/product/viewmodel/product-result.viewmodel';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css'],
    providers: [HelperService]
})
export class OrderListComponent extends BaseListComponent<OrderSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild('confirmCancelOrder', {static: true}) swalConfirmCancel: SwalComponent;
    orderId: string;
    fromDate;
    toDate;
    userId;
    productId;
    status;
    // Setting Datagrid
    filterRow = true;
    filterHeader = true;
    groupColumn = true;
    chooseColumn = false;
    orderDetail: OrderDetailViewModel;
    orderStatus = OrderStatus;
    listStatus = [{id: OrderStatus.Draft, name: 'Nháp'},
        {id: OrderStatus.Pending, name: 'Đang xử lý'},
        {id: OrderStatus.Approved, name: 'Đã duyệt'},
        {id: OrderStatus.Decline, name: 'Từ chối'},
        {id: OrderStatus.Approved, name: 'Đã giao'},
        {id: OrderStatus.Completed, name: 'Hoàn thành'},
        {id: OrderStatus.Canceled, name: 'Đã hủy'}];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private helperService: HelperService,
                private utilService: UtilService,
                private orderService: OrderService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.ORDER_MANAGEMENT, this.pageId.ORDER);

        this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<OrderSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listItems = data.items;
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.status = params.status ? parseInt(params.status) : '';
            this.userId = params.userId ? params.userId : '';
            this.fromDate = params.fromDate ? params.fromDate : '';
            this.toDate = params.toDate ? params.toDate : '';
            this.productId = params.productId ? params.productId : null;
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.swalConfirmCancel.confirm.subscribe(result => {
            this.cancel(this.orderId);
        });
    }

    add() {
    }

    showDetail(value) {
        const orderInfo = _.find(this.listItems, (item: OrderSearchViewModel) => {
            return item.id === value.key;
        });

        if (orderInfo && (!orderInfo.orderDetails || orderInfo.orderDetails.length === 0)) {
            this.orderService.getDetail(value.key).subscribe((result: ActionResultViewModel<OrderDetailViewModel>) => {
                orderInfo.orderDetails = result.data.orderDetails;
            });
        }
    }

    onProductSelected(item: NhSuggestion) {
        this.productId = item.id;
        this.search(1);
    }

    onProductRemoved() {
        this.productId = '';
        this.search(1);
    }

    resetFormSearch() {
        this.search(1);
    }

    getDetail(id) {
    }

    edit(id) {
    }

    search(currentPage = 1) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.orderService.search(this.keyword, this.userId, this.productId, this.status, this.fromDate, this.toDate,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: SearchResultViewModel<OrderSearchViewModel>) => {
                this.totalRows = data.totalRows;
                this.listItems = data.items;
            });
    }

    changePageSize(value: number) {
        this.pageSize = value;
        this.search(1);
    }

    rightClickContextMenu(e) {
        if (e.row.rowType === 'data' && (this.permission.delete || this.permission.edit || this.permission.view)) {
            const data = e.row.data;
            e.items = [{
                text: 'Xem',
                icon: 'info',
                disabled: !this.permission.view,
                onItemClick: () => {
                    this.getDetail(data);
                }
            }, {
                text: 'Sửa',
                icon: 'edit',
                disabled: !this.permission.edit,
                onItemClick: () => {
                    this.edit(data.id);
                }
            }, {
                text: 'Hủy đơn hàng',
                icon: 'remove',
                disabled: !this.permission.delete,
                onItemClick: () => {
                    this.confirm(data);
                }
            }];
        }
    }

    selectStatus(value: NhSuggestion) {
        this.status = value.id;
        this.search(1);
    }

    confirm(value: OrderSearchViewModel) {
        this.orderId = value.id;
    }

    cancel(id: string) {
        this.orderService.updateStatus(id, OrderStatus.Canceled).subscribe(() => {
            this.search(1);
        });
    }

    private renderFilterLink() {
        const path = 'order';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('status', this.status),
            new FilterLink('userId', this.userId),
            new FilterLink('productId', this.productId),
            new FilterLink('fromDate', this.fromDate),
            new FilterLink('toDate', this.toDate),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
