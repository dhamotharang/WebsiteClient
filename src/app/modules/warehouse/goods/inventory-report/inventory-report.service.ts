import {Inject, Injectable} from '@angular/core';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { WarehouseCardViewModel } from './warehouse-card/warehouse-card.viewmodel';
import { WarehouseCardDetailViewModel } from './warehouse-card-detail/warehouse-card-detail.viewmodel';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class InventoryReportService implements Resolve<any> {
    url = 'api/v1/warehouse/inventory-reports';

    constructor(private spinnerService: SpinnerService, @Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig, private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        // return this.search(queryParams.keyword, queryParams.warehSouseId, queryParams.fromDate, queryParams.toDate, queryParams.page,
        //     queryParams.pageSize);
        return null;
    }

    search(keyword: string, warehouseId: string, fromDate: string, toDate: string, page: number, pageSize?: number) {
        this.spinnerService.show();
        return this.http.get(this.url, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword.toString() : '')
                .set('warehouseId', warehouseId ? warehouseId.toString() : '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '20')
        }).pipe(finalize(() => this.spinnerService.hide()));
    }

    // searchWarehouseCard(keyword: string, warehouseId: string, fromDate: string, toDate: string, page: number, pageSize?: number) {
    //     return this.http.get(`${this.url}/warehouse-cards`, {
    //         params: new HttpParams()
    //             .set('keyword', keyword ? keyword.toString() : '')
    //             .set('warehouseId', warehouseId ? warehouseId.toString() : '')
    //             .set('fromDate', fromDate ? fromDate : '')
    //             .set('toDate', toDate ? toDate : '')
    //             .set('page', page ? page.toString() : '1')
    //             .set('pageSize', pageSize ? pageSize.toString() : '20')
    //     });
    // }

    searchWarehouseCard(warehouseId: string, productId: string, fromDate: string, toDate: string, page: number, pageSize?: number) {
        this.spinnerService.show();
        return this.http.get(`${this.url}/warehouse-cards`, {
            params: new HttpParams()
                .set('warehouseId', warehouseId ? warehouseId : '')
                .set('productId', productId ? productId : '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '100')
        })
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<WarehouseCardViewModel>) => {
                    return result.data;
                }));
    }

    searchWarehouseCardDetail(warehouseId: string, productId: string, fromDate: string, toDate: string, page: number, pageSize?: number) {
        this.spinnerService.show();
        return this.http.get(`${this.url}/warehouse-card-details`, {
            params: new HttpParams()
                .set('warehouseId', warehouseId ? warehouseId : '')
                .set('productId', productId ? productId : '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '100')
        })
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<WarehouseCardDetailViewModel>) => {
                    return result.data;
                }));
    }

    getProduct(warehouseId: string, productId: string, date: string) {
        return this.http.get(`${this.url}/products/${productId}`, {
            params: new HttpParams()
                .set('warehouseId', warehouseId)
                .set('date', date)
        }).pipe(map((result: IActionResultResponse) => {
            return result.data;
        }));
    }

    getAllProductToTakeInventory(warehouseId: string, date: string) {
        this.spinnerService.show();
        return this.http.get(`${this.url}/products`, {
            params: new HttpParams()
                .set('warehouseId', warehouseId)
                .set('date', date)
        }).pipe(
            finalize(() => this.spinnerService.hide()),
            map((result: SearchResultViewModel<any>) => {
                return result.items;
            }));
    }
}
