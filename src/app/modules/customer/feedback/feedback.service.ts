import {FeedbackSearchViewModel} from './viewmodel/feedback-search.viewmodel';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {finalize} from 'rxjs/internal/operators';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {Observable} from 'rxjs';
import {Inject} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {FeedbackDetailViewModel} from './viewmodel/feedback-detail.viewmodel';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {environment} from '../../../../environments/environment';

export class FeedbackService implements Resolve<FeedbackSearchViewModel> {
    url = 'api/v1/website/feedBacks';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private http: HttpClient,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.fromDate,
            queryParams.toDate,
            queryParams.isResolve,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, fromDate?: Date, toDate?: Date, isResolve?: boolean, page: number = 1,
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<SearchResultViewModel<FeedbackSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('startDate', fromDate ? fromDate.toString() : '')
            .set('endDate', toDate ? toDate.toString() : '')
            .set('isResolve', isResolve ? isResolve.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }).pipe(map((result: SearchResultViewModel<FeedbackSearchViewModel>) => {
            return result;
        })) as Observable<SearchResultViewModel<FeedbackSearchViewModel>>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<FeedbackDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/${id}`, {})
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<FeedbackDetailViewModel>>;
    }

    updateResolve(id: string, resolved: any): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/${id}`, resolved)
            .pipe(finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }
}
