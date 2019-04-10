import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { Course } from './course.model';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import {environment} from '../../../../environments/environment';

@Injectable()
export class CourseService implements Resolve<any> {
    url = 'api/v1/website/course/';

    constructor( @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        const keyword = queryParams.keyword;
        const isActive = queryParams.isActive;
        const page = queryParams.page;
        const pageSize = queryParams.pageSize;
        return this.search(keyword, isActive, page, pageSize);
    }

    insert(course: Course): Observable<IResponseResult> {
        return this.http.post(`${this.url}insert`, course) as Observable<IResponseResult>;
    }

    update(course: Course): Observable<IResponseResult> {
        return this.http.post(`${this.url}update`, course) as Observable<IResponseResult>;
    }

    delete(id: number): Observable<IResponseResult> {
        return this.http.delete(`${this.url}delete/${id}`) as Observable<IResponseResult>;
    }

    search(keyword: string, isActive?: boolean, page: number = 1, pageSize: number = 20): Observable<ISearchResult<Course>> {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<ISearchResult<Course>>;
    }
}
