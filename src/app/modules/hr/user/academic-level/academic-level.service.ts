import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { AcademicLevel } from './academic-level.model';

@Injectable()
export class AcademicLevelService {
    url = 'user/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient) {
    }

    insert(academicLevel: AcademicLevel): Observable<number> {
        return this.http.post(`${this.url}insert-academic-level`, academicLevel) as Observable<number>;
    }

    update(academicLevel: AcademicLevel): Observable<number> {
        return this.http.post(`${this.url}update-academic-level`, academicLevel) as Observable<number>;
    }

    delete(id: number) {
        return this.http.get(`${this.url}delete-academic-level`, {
            params: new HttpParams().set('id', id.toString())
        }) as Observable<number>;
    }

    search(userId: string, levelId?: number, degreeId?: number, schoolId?: number, specializeId?: number, page?: number,
           pageSize?: number): Observable<any[]> {
        return this.http.get(`${this.url}search-academic-level`, {
            params: new HttpParams()
                .set('userId', userId)
                .set('levelId', levelId ? levelId.toString() : '')
                .set('degreeId', degreeId ? degreeId.toString() : '')
                .set('schoolId', schoolId ? schoolId.toString() : '')
                .set('specializeId', specializeId ? specializeId.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<any[]>;
    }
}
