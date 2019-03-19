import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { NhSuggestion } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { finalize } from 'rxjs/internal/operators';
import { ActivatedRouteSnapshot } from '@angular/router';
import { WarehouseSearchViewModel } from '../viewmodel/warehouse-search.viewmodel';
import { Warehouse } from '../model/warehouse.model';
import { WarehouseManagerConfig } from '../model/warehouse-manager-config.model';
import { WarehouseDetailViewModel } from '../viewmodel/warehouse-detail.viewmodel';
import { WarehouseLimit } from '../model/warehouse-limit.model';
import { WarehouseLimitSearchViewModel } from '../viewmodel/warehouse-limit-search.viewmodel';
import { SuggestionViewModel } from '../../../../shareds/view-models/SuggestionViewModel';

export class WarehouseService {

    url = 'api/v1/warehouse/warehouses';

    constructor(@Inject(APP_CONFIG)
                private appConfig: IAppConfig,
                private spinceService: SpinnerService,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${appConfig.API_GATEWAY_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.isActive,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, isActive?: boolean, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<WarehouseSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }) as Observable<SearchResultViewModel<WarehouseSearchViewModel>>;
    }

    insert(warehouse: Warehouse): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, warehouse).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, warehouse: Warehouse): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}`, warehouse).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateStatus(id: string, isActive: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/actives/${isActive}`, {}).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<WarehouseDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}`)
            .pipe(finalize(() => this.spinnerService.hide()))as Observable<ActionResultViewModel<WarehouseDetailViewModel>>;
    }

    suggestions(keyword: string, page: number, pageSize: number): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http.get(`${this.url}/suggestions`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '10')
        }) as Observable<SearchResultViewModel<NhSuggestion>>;
    }

    // ManagerConfig
    getManagerConfigByWarehouseId(warehouseId: string, isActive: boolean, page: number = 1,
                                  pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<WarehouseManagerConfig>> {
        const params = new HttpParams()
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}/${warehouseId}/warehouse-manager-configs`, {
            params: params
        }) as Observable<SearchResultViewModel<WarehouseManagerConfig>>;
    }

    insertManagerConfig(warehouseId: string, warehouseManagerConfig: WarehouseManagerConfig): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${warehouseId}/warehouse-manager-configs`, warehouseManagerConfig)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateManagerConfig(warehouseId: string, userId: string,
                        warehouseManagerConfig: WarehouseManagerConfig): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${warehouseId}/warehouse-manager-configs/${userId}`, warehouseManagerConfig)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    deleteManagerConfig(warehouseId: string, userId: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${warehouseId}/warehouse-manager-configs/${userId}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    // Warehouse limit
    insertWarehouseLimit(warehouseId: string, warehouseLimit: WarehouseLimit): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${warehouseId}/warehouse-limits`, warehouseLimit)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    searchWarehouseLimit(warehouseId: string, keyword: string, page: number = 1,
                         pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<WarehouseLimitSearchViewModel>> {
        return this.http.get(`${this.url}/${warehouseId}/warehouse-limits`,
            {
                params: new HttpParams()
                    .set('keyword', keyword ? keyword : '')
                    .set('page', page ? page.toString() : '1')
                    .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
            }).pipe(map((result: SearchResultViewModel<WarehouseLimit>) => {
            result.items.forEach((item: WarehouseLimitSearchViewModel) => {
                item.isNew = false;
                item.isEdit = false;
            });
            return result;
        }))as Observable<SearchResultViewModel<WarehouseLimitSearchViewModel>>;
    }

    deleteWarehouseLimit(warehouseId: string, productId: string, unitId: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${warehouseId}/warehouse-limits/${productId}/${unitId}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    managerSuggestion(warehouseId: string, keyword: string, page: number,
                      pageSize: number): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http
            .get(`${this.url}/${warehouseId}/managers`, {
                params: new HttpParams()
                    .set('keyword', keyword ? keyword : '')
                    .set('page', page ? page.toString() : '1')
                    .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
            }) as Observable<SearchResultViewModel<NhSuggestion>>;
    }

    productSuggestions(warehouseId: string, keyword: string, page: number,
                       pageSize: number): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http.get(`${this.url}/${warehouseId}/product-suggestions`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<NhSuggestion>>;
    }

    getAllProductToTakeInventory(warehouseId: string) {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${warehouseId}/products`)
            .pipe(finalize(() => this.spinnerService.hide()));
    }

    getConfigs(id: string) {
        return this.http.get(`${this.url}/${id}/configs`);
    }
}
