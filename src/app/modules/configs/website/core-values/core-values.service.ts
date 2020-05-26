import {HttpClient, HttpParams} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import { Inject, Injectable } from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {Observable} from 'rxjs';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {finalize, map} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {SpinnerService} from '../../../../core/spinner/spinner.service';
import {CoreValuesSearchViewModel} from './viewmodel/core-values-search.viewmodel';
import {CoreValue} from './model/core-value.model';
import {CoreValueDetailViewModel} from './viewmodel/core-value-detail.viewmodel';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class CoreValuesService {
    url = 'api/v1/website/core-values/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private httpClient: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    search(keyword: string, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE)
        : Observable<SearchResultViewModel<CoreValuesSearchViewModel>> {
        this.spinnerService.show();
        return this.httpClient.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('page', page.toString())
                .set('pageSize', pageSize.toString())
        }).pipe(finalize(() => this.spinnerService.hide()), map((result: SearchResultViewModel<CoreValuesSearchViewModel>) => {
            return result;
        })) as Observable<SearchResultViewModel<CoreValuesSearchViewModel>>;
    }

    insert(coreValue: CoreValue): Observable<ActionResultViewModel> {
        return this.httpClient.post(`${this.url}`, coreValue).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(id: string): Observable<ActionResultViewModel<CoreValueDetailViewModel>> {
        this.spinnerService.show();
        return this.httpClient.get(`${this.url}${id}`, {})
            .pipe(finalize(() => {
                this.spinnerService.hide();
            })) as Observable<ActionResultViewModel<CoreValueDetailViewModel>>;
    }

    update(id: string, coreValue: CoreValue): Observable<ActionResultViewModel> {
        return this.httpClient.post(`${this.url}${id}`, coreValue).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.httpClient.delete(`${this.url}/${id}`).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
