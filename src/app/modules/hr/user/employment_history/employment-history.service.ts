import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { EmploymentHistory } from './employment-history.model';

@Injectable()
export class EmploymentHistoryService {
    url = 'employment-history/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient) {
        this.url = `${appConfig.HR_API_URL}${this.url}`;
    }

    search(keyword: string, userId: string, type?: boolean, companyId?: number, isCurrent?: boolean,
           fromDate?: string, toDate?: string, page = 1, pageSize = 20) {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('userId', userId)
                .set('type', type ? type.toString() : '')
                .set('companyId', companyId ? companyId.toString() : '')
                .set('isCurrent', isCurrent != null ? isCurrent.toString() : '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        });
    }

    insert(employment: EmploymentHistory): Observable<number> {
        return this.http.post(`${this.url}insert`, employment) as Observable<number>;
    }

    update(employment: EmploymentHistory): Observable<number> {
        return this.http.post(`${this.url}update`, employment) as Observable<number>;
    }

    delete(id: number): Observable<number> {
        // let params = new URLSearchParams();
        // params.set("id", id.toString());
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams()
                .set('id', id.toString())
        }) as Observable<number>;
    }

    searchCompany(): Observable<any> {
        return this.http.get(`${this.url}search-company`) as Observable<any>;
    }
}
