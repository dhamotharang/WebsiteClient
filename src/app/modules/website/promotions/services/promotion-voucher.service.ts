import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { PromotionVoucher } from '../model/promotion-voucher.model';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class PromotionVoucherService {
    url = 'api/v1/website/promotion-voucher/';

    constructor( @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    insert(voucher: PromotionVoucher): Observable<PromotionVoucher> {
        return this.http.post(`${this.url}insert`, voucher) as Observable<PromotionVoucher>;
    }

    inserts(quantity: number, promotionId: string): Observable<ISearchResult<PromotionVoucher>> {
        return this.http.post(`${this.url}inserts`, '', {
            params: new HttpParams()
                .set('quantity', quantity.toString())
                .set('promotionId', promotionId)
        }) as Observable<ISearchResult<PromotionVoucher>>;
    }

    update(voucher: PromotionVoucher): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}update`, voucher) as Observable<IActionResultResponse>;
    }

    search(keyword: string, promotionId: string, page: number = 1, pageSize: number = 20) {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('promotionId', promotionId)
                .set('page', page.toString())
                .set('pageSize', pageSize.toString())
        }) as Observable<ISearchResult<PromotionVoucher>>;
    }

    delete(id: string) {
        return this.http.post(`${this.url}delete`, '', {
            params: new HttpParams()
                .set('id', id)
        });
    }
}
