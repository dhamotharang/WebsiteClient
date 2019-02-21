import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { CommendationDiscipline } from './commendation-discipline.model';

@Injectable()
export class CommendationDisciplineService {
    url = 'user/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient) {

    }

    search(keyword: string, userId: string, type: boolean, categoryId: number, fromDate: string,
           toDate: string, page: number, pageSize: number) {
        return this.http.get(`${this.url}search-commendation-discipline`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('userId', userId)
                .set('type', type ? type.toString() : '')
                .set('categoryId', categoryId ? categoryId.toString() : '')
                .set('officeId', '')
                .set('titleId', '')
                .set('fromDate', fromDate ? fromDate : '')
                .set('toDate', toDate ? toDate : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        });
    }

    insert(model: CommendationDiscipline): Observable<number> {
        return this.http.post(`${this.url}insert-commendation-discipline`, model) as Observable<number>;
    }

    update(model: CommendationDiscipline): Observable<number> {
        return this.http.post(`${this.url}update-commendation-discipline`, model) as Observable<number>;
    }

    delete(id: number): Observable<number> {
        return this.http.get(`${this.url}delete-commendation-discipline`, {
            params: new HttpParams()
                .set('id', id.toString())
        }) as Observable<number>;
    }

    getListCategory(type?: any): Observable<any> {
        return this.http.get(`${this.url}search-commendation-discipline-category`, {
            params: new HttpParams()
                .set('type', type ? type.toString() : '')
        }) as Observable<any>;
    }
}
