import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { Observable } from 'rxjs/internal/Observable';
import { ApproverViewModel } from './view-models/approver.viewmodel';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { SuggestionViewModel } from '../../../shareds/view-models/SuggestionViewModel';
import { finalize } from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

@Injectable()
export class ApproverService implements Resolve<any> {
    url = 'api/v1/core/approver-configs';

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${environment.apiGatewayUrl}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const params = route.queryParams;
        return this.search(params.keyword, params.isActive);
    }

    search(keyword: string, type?: number, page: number = 1,
           pageSize: number = 20): Observable<SearchResultViewModel<ApproverViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('type', type != null && type !== undefined ? type.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<SearchResultViewModel<ApproverViewModel>>;
    }

    insert(userId: string, type: number): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}/${userId}/${type}`, {})
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    delete(userId: string, type: number): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}/${userId}/${type}`)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel>;
    }

    getTypes(): Observable<SuggestionViewModel<number>[]> {
        return this.http.get(`${this.url}/types`) as Observable<SuggestionViewModel<number>[]>;
    }
}
