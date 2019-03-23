import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';
import { APP_CONFIG, IAppConfig } from '../../../../../configs/app.config';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../../core/spinner/spinner.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, map } from 'rxjs/internal/operators';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { Observable } from 'rxjs';
import { Inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { InventorySearchViewModel } from '../viewmodel/inventory-search.viewmodel';
import { Inventory } from '../model/inventory.model';
import { InventoryDetailViewModel } from '../viewmodel/inventory-detail.viewmodel';
import { InventoryDetail } from '../model/inventory-detail.model';
import { InventoryMember } from '../model/inventory-member.model';
import {environment} from '../../../../../../environments/environment';

export class InventoryService {
    url = 'api/v1/warehouse/inventories';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinceService: SpinnerService,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.fromDate,
            queryParams.toDate,
            queryParams.isResolve,
            queryParams.warehouseId,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, fromDate: string, toDate: string, isResolve: number, warehouseId?: string, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<InventorySearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('fromDate', fromDate ? fromDate : '')
            .set('toDate', toDate ? toDate : '')
            .set('isResolve', isResolve !== null && isResolve !== undefined ? isResolve.toString() : '')
            .set('warehouseId', warehouseId ? warehouseId : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }) as Observable<SearchResultViewModel<InventorySearchViewModel>>;
    }

    insert(inventory: Inventory, isBalanced: boolean): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/balanced/${isBalanced}`, inventory).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })).pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    update(id: string, inventory: Inventory, isBalanced: boolean): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${id}/balanced/${isBalanced}`, inventory).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })).pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${id}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getDetailForEdit(id: string): Observable<ActionResultViewModel<InventoryDetailViewModel>> {
        this.spinceService.show();
        return this.http.get(`${this.url}/edit/${id}`, {})
            .pipe(finalize(() => {
                this.spinceService.hide();
            }))as Observable<ActionResultViewModel<InventoryDetailViewModel>>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<InventoryDetailViewModel>> {
        this.spinceService.show();
        return this.http.get(`${this.url}/${id}`, {})
            .pipe(finalize(() => {
                this.spinceService.hide();
            }))as Observable<ActionResultViewModel<InventoryDetailViewModel>>;
    }

    searchProduct(inventoryId: string, keyword: string, page: number = 1,
                  pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<InventoryDetail>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());
        return this.http.get(`${this.url}/${inventoryId}/detail`, {
            params: params
        }) as Observable<SearchResultViewModel<InventoryDetail>>;
    }

    insertProduct(inventoryId: string, inventoryDetail: InventoryDetail): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${inventoryId}/detail`, inventoryDetail)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateProduct(inventoryDetail: InventoryDetail): Observable<ActionResultViewModel> {
        return this.http
            .post(`${this.url}/${inventoryDetail.inventoryId}/detail/${inventoryDetail.productId}`,
                inventoryDetail) as Observable<ActionResultViewModel>;
    }

    deleteProduct(inventoryId: string, productId: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${inventoryId}/products/${productId}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    insertInventoryMember(inventoryId: string, inventoryMember: InventoryMember): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${inventoryId}/member`, inventoryMember)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateInventoryMember(inventoryId: string, inventoryMemberId: string,
                          inventoryMember: InventoryMember): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${inventoryId}/member/${inventoryMemberId}`, inventoryMember)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    deleteInventoryMember(inventoryId: string, inventoryMemberId: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${inventoryId}/member/${inventoryMemberId}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getProductByWarehouseId(keyword: string, warehouseId: string, date: string, page: number,
                            pageSize: number): Observable<SearchResultViewModel<InventoryDetail>> {
        this.spinceService.show();
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('date', date ? date : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());
        return this.http.get(`${this.url}/products/${warehouseId}`, {
            params: params
        }).pipe(finalize(() => {
            this.spinceService.hide();
        })) as Observable<SearchResultViewModel<InventoryDetail>>;
    }

    balancedWarehouse(inventoryId: string): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/balanced-warehouse/${inventoryId}`, {})
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    export(inventoryId: string, inventory: Inventory, isBalance: boolean) {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${inventoryId}/exports/${isBalance}`, inventory, {responseType: 'blob'})
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map(response => {
                    return new Blob([response]);
                }));
    }
}
