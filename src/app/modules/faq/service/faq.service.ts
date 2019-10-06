import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ActivatedRouteSnapshot} from '@angular/router';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {AppService} from '../../../shareds/services/app.service';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {FaqGroupViewModel} from '../model/faq-group.viewmodel';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {Event} from '../../event/models/event.model';
import {finalize, map} from 'rxjs/operators';
import {FaqGroup} from '../model/faq-group.model';
import {FaqGroupDetailViewModel} from '../model/faq-group.detail.viewmodel';

@Injectable({
    providedIn: 'root'
})

export class FaqService {
    url = 'api/v1/website/faqs';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private appService: AppService,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
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

    search(keyword: string, isActive?: boolean, page: number = 1, pageSize: number = 20): Observable<SearchResultViewModel<FaqGroupViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('languageId', this.appService.currentLanguage)
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : null)
        }).pipe(finalize(() => this.spinnerService.hide())) as Observable<SearchResultViewModel<FaqGroupViewModel>>;
    }

    insertGroup(faqGroup: FaqGroup): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/group`, faqGroup)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }

    updateGroup(id: string, faqGroup: FaqGroup): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.url}/group/${id}`, faqGroup)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }

    getDetailGroup(id: string): Observable<ActionResultViewModel<FaqGroupDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}/group/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<FaqGroupDetailViewModel>) => {
                    return result;
                })
            ) as Observable<ActionResultViewModel<FaqGroupDetailViewModel>>;
    }

    deleteGroup(id: string): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.delete(`${this.url}/group/${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                })
            ) as Observable<ActionResultViewModel>;
    }
}