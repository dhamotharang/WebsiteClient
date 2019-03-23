import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { Observable } from 'rxjs';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { GoodsReceiptNoteViewModel } from './goods-receipt-note.viewmodel';
import { GoodsReceiptNote, GoodsReceiptNoteDetail } from './goods-receipt-note.model';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { finalize, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { NhSuggestion } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { GoodsReceiptNoteBarcodeViewModel } from './goods-receipt-note-print-barcode/goods-receipt-note-barcode.viewmodel';
import { WarehouseCardViewModel } from '../inventory-report/warehouse-card/warehouse-card.viewmodel';
import { WarehouseCardDetailViewModel } from '../inventory-report/warehouse-card-detail/warehouse-card-detail.viewmodel';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class GoodsReceiptNoteService implements Resolve<any> {
    url = 'api/v1/warehouse/goods-receipt-notes';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const params = route.queryParams;
        return this.search(params.keyword, params.supplierId, params.warehouseId, params.deliverId,
            params.fromDate, params.toDate, params.page, params.pageSize);
    }

    search(keyword: string, supplierId: string, warehouseId: string, deliverId, fromDate: string, toDate: string, page: number,
           pageSize: number = 10): Observable<SearchResultViewModel<GoodsReceiptNoteViewModel>> {
        return this.http.get(this.url, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('supplierId', supplierId ? supplierId : '')
                .set('warehouseId', warehouseId ? warehouseId : '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<GoodsReceiptNoteViewModel>>;
    }

    getDetail(receiptId: string): Observable<GoodsReceiptNote> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${receiptId}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<GoodsReceiptNote>) => {
                    return result.data;
                })) as Observable<GoodsReceiptNote>;
    }

    insert(goodsReceiptNote: GoodsReceiptNote): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(this.url, goodsReceiptNote)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    update(id: string, goodsReceiptNote: GoodsReceiptNote): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${id}`, goodsReceiptNote)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    insertItem(receiptId: string,
               goodsReceiptNoteItem: GoodsReceiptNoteDetail): Observable<ActionResultViewModel<{ id: string, concurrencyStamp: string } | string>> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${receiptId}/details`,
            goodsReceiptNoteItem)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<{ id: string, concurrencyStamp: string } | string>>;
    }

    updateItem(receiptId: string, itemId: string, goodsReceiptNoteItem: GoodsReceiptNoteDetail): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${receiptId}/details/${itemId}`, goodsReceiptNoteItem)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    deleteItem(receiptId: string, itemId: string): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}/${receiptId}/details/${itemId}`)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    lotSuggestion(keyword: string, page: number, pageSize: number): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http.get(`${this.url}/lots`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<NhSuggestion>>;
    }

    deliverSuggestion(supplierId: string, keyword: string, page: number,
                      pageSize: number): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http.get(`${this.url}/delivers`, {
            params: new HttpParams()
                .set('supplierId', supplierId ? supplierId : '')
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<NhSuggestion>>;
    }

    followSuggestion(keyword: string, page: number, pageSize: number): Observable<SearchResultViewModel<NhSuggestion>> {
        return this.http.get(`${this.url}/follows`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<NhSuggestion>>;
    }

    getBarcode(id: string): Observable<GoodsReceiptNoteBarcodeViewModel[]> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}/barcodes`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: SearchResultViewModel<GoodsReceiptNoteBarcodeViewModel>) => result.items)
            ) as Observable<GoodsReceiptNoteBarcodeViewModel[]>;
    }

    getProductInfoByCode(code: string, warehouseId: string, type: number, deliveryDate: string) {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}/details/${code}`, {
                params: new HttpParams()
                    .set('warehouseId', warehouseId)
                    .set('code', code)
                    .set('type', type.toString())
                    .set('deliveryDate', deliveryDate)
            })
            .pipe(finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<any>) => result.data)
            );
    }
}
