import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Client } from './client.model';
import { Observable } from 'rxjs';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable()
export class ClientService implements Resolve<any> {
    url: string;

    constructor(private http: HttpClient,
        @Inject(APP_CONFIG) public appConfig: IAppConfig) {
        this.url = `${appConfig.CORE_API_URL}client/`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const enabled = queryParams.enabled;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(keyword, enabled, page, pageSize);
    }

    search(keyword: string, enabled?: boolean, page: number = 1, pageSize: number = 20) {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('enabled', enabled != null && enabled !== undefined ? enabled.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<ISearchResult<Client>>;
    }

    getCientId(): Observable<string> {
        return this.http.get(`${this.url}get-client-id`) as Observable<string>;
    }

    getDetail(clientId: string): Observable<Client> {
        return this.http.get(`${this.url}get-detail`, {
            params: new HttpParams()
                .set('clientId', clientId)
        }) as Observable<Client>;
    }

    insert(client: Client): Observable<IResponseResult> {
        return this.http.post(`${this.url}insert`, client) as Observable<IResponseResult>;
    }

    update(client: Client): Observable<IResponseResult> {
        return this.http.post(`${this.url}update`, client) as Observable<IResponseResult>;
    }

    delete(clientId: string): Observable<IResponseResult> {
        return this.http.delete(`${this.url}`, {
            params: new HttpParams()
                .set('clientId', clientId)
        }) as Observable<IResponseResult>;
    }
}
