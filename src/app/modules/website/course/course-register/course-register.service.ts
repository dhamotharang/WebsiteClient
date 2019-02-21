import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponseResult } from '../../../../interfaces/iresponse-result';
import { CourseRegister } from './course-register.model';

@Injectable()
export class CourseRegisterService {
    url = 'course-register/';

    constructor( @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private http: HttpClient) {
        this.url = `${appConfig.WEBSITE_API_URL}${this.url}`;
    }

    insert(courseRegister: CourseRegister): Observable<IResponseResult> {
        return this.http.post(`${this.url}insert`, courseRegister) as Observable<IResponseResult>;
    }

    update(courseRegister: CourseRegister): Observable<IResponseResult> {
        return this.http.post(`${this.url}update`, courseRegister) as Observable<IResponseResult>;
    }

    delete(id: number): Observable<IResponseResult> {
        return this.http.delete(`${this.url}delete`, {
            params: new HttpParams()
                .set('id', id.toString())
        }) as Observable<IResponseResult>;
    }

    search(keyword: string, courseId: number, classId: number, status?: number, page: number = 1, pageSize: number = 20) {
        return this.http.get(`${this.url}search`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('courseId', courseId.toString())
                .set('classId', classId.toString())
                .set('status', status != null && status !== undefined ? status.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        });
    }
}
