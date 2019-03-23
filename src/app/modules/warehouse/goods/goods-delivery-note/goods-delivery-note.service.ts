///<reference path="../../../../../../node_modules/rxjs/internal/operators/finalize.d.ts"/>
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { ToastrService } from 'ngx-toastr';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { Inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { GoodsDeliveryNoteSearchViewModel } from './viewmodel/goods-delivery-note.search.viewmodel';
import { GoodsDeliveryNote } from './model/goods-delivery-note.model';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { finalize, map } from 'rxjs/internal/operators';
import { GoodsDeliveryNoteDetail } from './model/goods-delivery-note-details.model';
import { GoodsDeliveryNoteDetailViewModel } from './viewmodel/goods-delivery-note.detail.viewmodel';
import { ProductInfoDeliveryViewModel } from './viewmodel/product-info-delivery.viewmodel';
import {environment} from '../../../../../environments/environment';

export class GoodsDeliveryNoteService implements Resolve<any> {
    url = 'api/v1/warehouse/goods-delivery-notes';

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
            queryParams.type,
            queryParams.warehouseId,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, fromDate: string, todate: string, type?: number, warehouseId?: string, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<GoodsDeliveryNoteSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('fromDate', fromDate ? fromDate : '')
            .set('todate', todate ? todate : '')
            .set('type', type ? type.toString() : '')
            .set('warehouseId', warehouseId ? warehouseId : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }) as Observable<SearchResultViewModel<GoodsDeliveryNoteSearchViewModel>>;
    }

    insert(goodsDeliveryNote: GoodsDeliveryNote): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, goodsDeliveryNote).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, goodsDeliveryNote: GoodsDeliveryNote): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}`, goodsDeliveryNote).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${id}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<GoodsDeliveryNoteDetailViewModel>> {
        this.spinceService.show();
        return this.http.get(`${this.url}/${id}`, {})
            .pipe(finalize(() => {
                this.spinceService.hide();
            }))as Observable<ActionResultViewModel<GoodsDeliveryNoteDetailViewModel>>;
    }

    deleteDetail(goosdReceiptNoteId: string, id: string): Observable<ActionResultViewModel<GoodsDeliveryNoteDetailViewModel>> {
        this.spinceService.show();
        return this.http.delete(`${this.url}/${goosdReceiptNoteId}/details/${id}`, {})
            .pipe(finalize(() => {
                this.spinceService.hide();
            }))as Observable<ActionResultViewModel<GoodsDeliveryNoteDetailViewModel>>;
    }

    searchProduct(goodsDeliveryNoteId: string, keyword: string, page: number = 1,
                  pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<GoodsDeliveryNoteDetail>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());
        return this.http.get(`${this.url}/${goodsDeliveryNoteId}/details`, {
            params: params
        }) as Observable<SearchResultViewModel<GoodsDeliveryNoteDetail>>;
    }

    insertProduct(goodsDeliveryNoteId: string, goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${goodsDeliveryNoteId}/details`, goodsDeliveryNoteDetail)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateProduct(goodsDeliveryNoteId: string, productId: string,
                  goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${goodsDeliveryNoteId}/details/${productId}`, goodsDeliveryNoteDetail)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    deleteProduct(goodsDeliveryNoteId: string, goodsDeliveryNoteDetailId: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${goodsDeliveryNoteId}/details/${goodsDeliveryNoteDetailId}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getProductInfoDelivery(warehouseId: string, productId: string): Observable<ActionResultViewModel<ProductInfoDeliveryViewModel>> {
        this.spinceService.show();
        return this.http.get(`${this.url}/product/${productId}/warehouse/${warehouseId}`)
            .pipe(finalize(() => {
                this.spinceService.hide();
            })) as Observable<ActionResultViewModel<ProductInfoDeliveryViewModel>>;
    }

    // export
    exportGoodsDeliveryDeltail(id: string) {
        return this.http.get(`${this.url}/export-goods-delivery-note/${id}`, {
            responseType: 'blob',
        }).pipe(map((response) => {
            return new Blob([response]);
        }));
    }

    updateDetail(goodsDeliveryNoteId: string, id: string, goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail) {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}/${goodsDeliveryNoteId}/details/${id}`, goodsDeliveryNoteDetail)
            .pipe(finalize(() => this.spinnerService.hide()));
    }

    updateRecommendedQuantity(id: string, recommendedQuantity: number, concurrencyStamp: string) {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}/details/${id}/recommended-quantity/${recommendedQuantity}`, {
                params: new HttpParams()
                    .set('concurrencyStamp', concurrencyStamp)
            })
            .pipe(finalize(() => this.spinnerService.hide()));
    }

    receiverSuggestion(keyword: string, page: number, pageSize: number) {
        return this.http.get(`${this.url}/receivers`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        });
    }
}
