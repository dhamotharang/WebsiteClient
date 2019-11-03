import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/internal/operators';
import {ActivatedRouteSnapshot} from '@angular/router';
import {Inject} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {environment} from '../../../../environments/environment';
import {AgencyViewModel} from './model/agency.viewmodel';
import {AgencyDetailViewModel} from './model/agency-detail.viewmodel';
import {Agency} from './model/agency.model';

export class AgencyService {
    url = 'api/v1/website/agency';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinceService: SpinnerService,
                private http: HttpClient,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
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
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<AgencyViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }) as Observable<SearchResultViewModel<AgencyViewModel>>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<AgencyDetailViewModel>> {
        this.spinceService.show();
        return this.http.get(`${this.url}/${id}`, {})
            .pipe(finalize(() => {
                this.spinceService.hide();
            }))as Observable<ActionResultViewModel<AgencyDetailViewModel>>;
    }

    insert(agency: Agency): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, agency).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: string, agency: Agency): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}`, agency).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}/${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    updateStatus(id: string, isActive: boolean): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${id}/status/${isActive}`, {}).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
