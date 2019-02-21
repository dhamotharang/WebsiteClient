import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { GhmMultiSelect } from './ghm-multi-select.model';

@Injectable()
export class GhmMultiSelectService {
    constructor(private http: HttpClient) { }
    search(url: string, keyword: string, page: number = 1, pageSize: number = 20): Observable<ISearchResult<GhmMultiSelect>> {
        return this.http.get(url, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '20')
        }) as Observable<ISearchResult<GhmMultiSelect>>;
    }
}
