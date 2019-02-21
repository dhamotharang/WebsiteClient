import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { APP_CONFIG, IAppConfig } from '../../../../../configs/app.config';
import { PatientSubjectSearchViewModel } from '../models/patient-subject-search.viewmodel';
import { PatientSubjectDetailViewModel } from '../models/patient-subject-detail.viewmodel';
import { PatientSubject } from '../models/patient-subject.model';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';

@Injectable()
export class PatientSubjectService implements Resolve<PatientSubject> {
    url = 'patient-subjects/';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private http: HttpClient,
                private toastr: ToastrService) {
        this.url = `${appConfig.PATIENT_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.isActive,
            queryParams.totalReduction,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, totalReduction: number, isActive?: boolean, page: number = 1,
           pageSize: number = 20): Observable<SearchResultViewModel<PatientSubjectSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('totalReduction', totalReduction ? totalReduction.toString() : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }).pipe(map((result: SearchResultViewModel<PatientSubjectSearchViewModel>) => {
            result.items.forEach((item: PatientSubjectSearchViewModel) => {
                item.activeStatus = item.isActive
                    ? 'Active'
                    : 'InActive';
            });
            return result;
        })) as Observable<SearchResultViewModel<PatientSubjectSearchViewModel>>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<PatientSubjectDetailViewModel>> {
        return this.http.get(`${this.url}${id}`, {})as Observable<ActionResultViewModel<PatientSubjectDetailViewModel>>;
    }

    insert(patientSubject: PatientSubject): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, {
            order: patientSubject.order,
            isActive: patientSubject.isActive,
            totalReduction: patientSubject.totalReduction,
            patientSubjectTranslations: patientSubject.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: number, patientSubject: PatientSubject): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, {
            order: patientSubject.order,
            isActive: patientSubject.isActive,
            concurrencyStamp: patientSubject.concurrencyStamp,
            totalReduction: patientSubject.totalReduction,
            patientSubjectTranslations: patientSubject.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`, {
            params: new HttpParams()
                .set('id', id)
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

}
