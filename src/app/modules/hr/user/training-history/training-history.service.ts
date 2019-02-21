import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { TrainingHistory } from './training-history.model';

@Injectable()
export class TrainingHistoryService {
    url = 'user/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient) {
    }

    search(keyword: string, userId: string, type?: boolean, courseId?: number, coursePlaceId?: number,
           isHasCertification?: boolean, fromDate?: string, toDate?: string, page = 1, pageSize = 20) {
        return this.http.get(`${this.url}search-training-history`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('userId', userId)
                .set('type', type != null ? type.toString() : '')
                .set('courseId', courseId ? courseId.toString() : '')
                .set('coursePlaceId', coursePlaceId ? coursePlaceId.toString() : '')
                .set('isHasCertification', isHasCertification ? isHasCertification.toString() : '')
                .set('fromDate', fromDate ? fromDate.toString() : '')
                .set('toDate', toDate ? toDate.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        });
    }

    insert(training: TrainingHistory): Observable<number> {
        return this.http.post(`${this.url}insert-training-history`, training) as Observable<number>;
    }

    update(training: TrainingHistory): Observable<number> {
        return this.http.post(`${this.url}update-training-history`, training) as Observable<number>;
    }

    delete(id: number): Observable<number> {
        return this.http.get(`${this.url}delete-training-history`, {
            params: new HttpParams()
                .set('id', id.toString())
        }) as Observable<number>;
    }

    getListCourse() {
        return this.http.get(`${this.url}search-list-course`);
    }

    getListCoursePlace() {
        return this.http.get(`${this.url}search-list-course-place`);
    }
}
