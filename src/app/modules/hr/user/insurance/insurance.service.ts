import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { Insurance } from './insurance.model';

@Injectable()
export class InsuranceService {
    url = 'user/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient) {
    }

    insert(insurance: Insurance): Observable<number> {
        return this.http.post(`${this.url}insert-insuarance`, insurance) as Observable<number>;
    }

    update(insurance: Insurance) {
        return this.http.post(`${this.url}update-insuarance`, insurance) as Observable<number>;
    }

    delete(id: number) {
        return this.http.get(`${this.url}delete-insuarance`, {
            params: new HttpParams()
                .set('id', id.toString())
        }) as Observable<number>;
    }

    search(keyword: string, userId: string, type?: boolean, fromDate?: string, toDate?: string, page: number = 1,
           pageSize: number = 20): Observable<any> {
        return this.http.get(`${this.url}search-insuarance`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('userId', userId)
                .set('type', type != null ? type.toString() : '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        });
    }
}
