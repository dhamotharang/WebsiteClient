import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { Classes } from './class.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponseResult } from '../../../../interfaces/iresponse-result';

@Injectable()
export class ClassService {
    url = 'class/';

    constructor( @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private http: HttpClient) {
        this.url = `${appConfig.WEBSITE_API_URL}${this.url}`;
    }

    insert(classes: Classes): Observable<IResponseResult> {
        return this.http.post(`${this.url}insert`, classes) as Observable<IResponseResult>;
    }

    update(classes: Classes): Observable<IResponseResult> {
        return this.http.post(`${this.url}update`, classes) as Observable<IResponseResult>;
    }

    delete(id: number): Observable<IResponseResult> {
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams()
                .set('id', id.toString())
        }) as Observable<IResponseResult>;
    }

    search(keyword: string, courseId: number, isActive?: boolean, page: number = 1, pageSize: number = 20) {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('courseId', courseId.toString())
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        });
    }
}
