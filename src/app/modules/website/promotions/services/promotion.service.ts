import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Promotion } from '../model/promotion.model';
import { Observable } from 'rxjs';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';

@Injectable()
export class PromotionService {
    url = 'promotion/';

    constructor( @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private http: HttpClient) {
        this.url = `${appConfig.WEBSITE_API_URL}${this.url}`;
    }

    search(keyword: string, fromDate?: string, toDate?: string, page: number = 1, pageSize: number = 20) {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('page', page.toString())
                .set('pageSize', pageSize.toString())
        });
    }

    insert(promotion: Promotion): Observable<{ id: string }> {
        return this.http.post(`${this.url}insert`, promotion) as Observable<{ id: string }>;
    }


    update(promotion: Promotion) {
        return this.http.put(`${this.url}update`, promotion);
    }

    delete(id: string, isConfirm?: boolean): Observable<IActionResultResponse> {
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams()
                .set('id', id)
                .set('isConfirm', isConfirm == null || isConfirm === undefined ? '' : isConfirm.toString())
        }) as Observable<IActionResultResponse>;
    }

    getDetail(id: string): Observable<Promotion> {
        return this.http.get(`${this.url}get-detail`, {
            params: new HttpParams().set('id', id)
        }) as Observable<Promotion>;
    }
}
