import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot } from '@angular/router';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { Menu } from './menu.model';
import {environment} from '../../../../environments/environment';

@Injectable()
export class MenuService {
    url = 'api/v1/website/menu/';

    constructor( @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const isActive = queryParams.isActive;
        return this.search(keyword, isActive);
    }

    insert(menu: Menu): Observable<IResponseResult> {
        return this.http.post(`${this.url}insert`, menu) as Observable<IResponseResult>;
    }

    update(menu: Menu): Observable<IResponseResult> {
        return this.http.post(`${this.url}update`, menu) as Observable<IResponseResult>;
    }

    delete(id: number): Observable<IResponseResult> {
        return this.http.delete(`${this.url}delete/${id}`) as Observable<IResponseResult>;
    }

    search(keyword: string, isActive?: boolean): Observable<Menu[]> {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
        }) as Observable<Menu[]>;
    }
}
