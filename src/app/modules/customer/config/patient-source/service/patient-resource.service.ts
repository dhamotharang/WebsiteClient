import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { APP_CONFIG, IAppConfig } from '../../../../../configs/app.config';
import { PatientResourceSearchViewModel } from '../models/patient-resource-search.viewmodel';
import { PatientResource } from '../models/patient-resource.model';
import { PatientResourceDetailViewModel } from '../models/patient-resource-detail.viewmodel';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { PatientResourceSearchForSelectViewModel } from '../models/patient-resource-search-for-select.viewmodel';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';
import { SpinnerService } from '../../../../../core/spinner/spinner.service';

@Injectable()
export class PatientResourceService implements Resolve<PatientResource> {
    url = 'patient-resources/';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${appConfig.PATIENT_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.isActive,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, isActive?: boolean, page: number = 1,
           pageSize: number = 20): Observable<SearchResultViewModel<PatientResourceSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }).pipe(map((result: SearchResultViewModel<PatientResourceSearchViewModel>) => {
            result.items.forEach((item: PatientResourceSearchViewModel) => {
                item.activeStatus = item.isActive
                    ? 'Active'
                    : 'InActive';
            });
            return result;
        })) as Observable<SearchResultViewModel<PatientResourceSearchViewModel>>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<PatientResourceDetailViewModel>> {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}${id}`, {})
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<PatientResourceDetailViewModel>>;
    }

    getAll(): Observable<SearchResultViewModel<PatientResourceSearchViewModel>> {
        return this.http.get(`${this.url}gets-all`).pipe(map((result: SearchResultViewModel<PatientResourceSearchViewModel>) => {
            result.items.forEach((item: PatientResourceSearchViewModel) => {
                item.activeStatus = item.isActive
                    ? 'Active'
                    : 'InActive';
            });
            return result;
        }))as Observable<SearchResultViewModel<PatientResourceSearchViewModel>>;
    }

    insert(patientResource: PatientResource): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, {
            order: patientResource.order,
            isActive: patientResource.isActive,
            patientResourceTranslations: patientResource.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, patientResource: PatientResource): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, {
            order: patientResource.order,
            isActive: patientResource.isActive,
            concurrencyStamp: patientResource.concurrencyStamp,
            patientResourceTranslations: patientResource.modelTranslations,
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

    searchForSelect(keyword: string, page: number = 1,
                    pageSize: number = 20): Observable<PatientResourceSearchForSelectViewModel[]> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : '20');

        return this.http.get(`${this.url}get-for-select`, {
            params: params
        }) as Observable<PatientResourceSearchForSelectViewModel[]>;
    }
}
