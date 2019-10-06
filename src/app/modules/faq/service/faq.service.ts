import {Inject, Injectable} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ActivatedRouteSnapshot} from '@angular/router';
import {TreeData} from '../../../view-model/tree-data';
import {map} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {AppService} from '../../../shareds/services/app.service';
import {ToastrService} from 'ngx-toastr';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {FaqGroupViewModel} from '../model/faq-group.viewmodel';

@Injectable({
    providedIn: 'root'
})

export class FaqService {
    url = 'api/v1/website/faqs';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private appService: AppService,
                private toasTrService: ToastrService,
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
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('languageId', this.appService.currentLanguage)
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : true.toString())
        }) as Observable<SearchResultViewModel<FaqGroupViewModel>>;
    }
}