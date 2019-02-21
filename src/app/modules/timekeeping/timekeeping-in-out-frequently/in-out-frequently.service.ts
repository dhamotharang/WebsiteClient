import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InOutFrequently, InOutFrequentlyDetail } from './in-out-frequently.model';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { Observable } from 'rxjs';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable()
export class InOutFrequentlyService implements Resolve<any> {
    url = 'in-out-frequently/';

    constructor(private http: HttpClient) {
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const isActive = queryParams.isActive;
        const fromDate = queryParams.fromDate;
        const toDate = queryParams.toDate;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(keyword, isActive, fromDate, toDate, page, pageSize);
    }

    search(keyword: string, isActive?: boolean, fromDate?: string, toDate?: string,
           page: number = 1, pageSize: number = 20): Observable<ISearchResult<InOutFrequently>> {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '20')
        }) as Observable<ISearchResult<InOutFrequently>>;
    }

    insert(inOutFrequently: InOutFrequently): Observable<IActionResultResponse> {
        const inLateOutEarlyFrequently = {
            id: inOutFrequently.id,
            userId: inOutFrequently.userId,
            fromDate: inOutFrequently.fromDate,
            toDate: inOutFrequently.toDate,
            inOutFrequentlyDetails: inOutFrequently.inOutFrequentlyDetails,
            note: inOutFrequently.note,
            reason: inOutFrequently.reason,
            isActive: inOutFrequently.isActive
        };
        return this.http.post(`${this.url}insert`, inLateOutEarlyFrequently) as Observable<IActionResultResponse>;
    }

    insertDetail(id: string, inOutFrequentlyDetail: InOutFrequentlyDetail): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}insert-detail`, inOutFrequentlyDetail, {
            params: new HttpParams()
                .set('id', id)
        }) as Observable<IActionResultResponse>;
    }

    update(inOutFrequently: InOutFrequently): Observable<IActionResultResponse> {
        const inLateOutEarlyFrequently = {
            id: inOutFrequently.id,
            userId: inOutFrequently.userId,
            fromDate: inOutFrequently.fromDate,
            toDate: inOutFrequently.toDate,
            inOutFrequentlyDetails: inOutFrequently.inOutFrequentlyDetails,
            note: inOutFrequently.note,
            reason: inOutFrequently.reason,
            isActive: inOutFrequently.isActive
        };
        return this.http.post(`${this.url}update`, inLateOutEarlyFrequently) as Observable<IActionResultResponse>;
    }

    updateDetail(id: string, inOutFrequentlyDetail: InOutFrequentlyDetail): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}update-detail`, inOutFrequentlyDetail, {
            params: new HttpParams()
                .set('id', id)
        }) as Observable<IActionResultResponse>;
    }

    updateActive(id: string, isActive: boolean): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}update-active`, '', {
            params: new HttpParams()
                .set('id', id)
                .set('isActive', isActive.toString())
        }) as Observable<IActionResultResponse>;
    }

    delete(id: string): Observable<IActionResultResponse> {
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams()
                .set('id', id)
        }) as Observable<IActionResultResponse>;
    }

    deleteDetail(id: string, detailId: string): Observable<IActionResultResponse> {
        return this.http.delete(`${this.url}delete-detail`, {
            params: new HttpParams()
                .set('id', id)
                .set('detailId', detailId)
        }) as Observable<IActionResultResponse>;
    }
}
