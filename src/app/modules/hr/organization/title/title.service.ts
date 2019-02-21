import { Inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Title } from './title.model';
import { TitleSearchViewModel } from './models/title-search.viewmodel';
import { map, finalize } from 'rxjs/operators';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { ToastrService } from 'ngx-toastr';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { TitleDetailViewModel } from './models/title-detail.viewmodel';
import { TitleSearchForSelectViewModel } from './title-search-for-select.viewmodel';
import { SpinnerService } from '../../../../core/spinner/spinner.service';

@Injectable()
export class TitleService implements Resolve<any> {
    url = 'titles/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${this.appConfig.HR_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        return this.search(queryParams.keyword, queryParams.isActive, queryParams.page, queryParams.pageSize);
    }

    search(keyword: string, isActive?: boolean, page: number = 1,
           pageSize: number = 20): Observable<ISearchResult<TitleSearchViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isActive', isActive != null ? isActive.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }).pipe(map((result: ISearchResult<TitleSearchViewModel>) => {
            result.items.forEach((item: TitleSearchViewModel) => {
                item.activeStatus = item.isActive ? 'active' : 'inActive';
            });
            return result;
        })) as Observable<ISearchResult<TitleSearchViewModel>>;
    }

    getAllActivated(): Observable<TitleSearchForSelectViewModel[]> {
        return this.http.get(`${this.url}activated`) as Observable<TitleSearchForSelectViewModel[]>;
    }

    getDetail(id: string): Observable<IActionResultResponse<TitleDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`)
            .pipe(finalize(() => this.spinnerService.hide()))as Observable<IActionResultResponse<TitleDetailViewModel>>;
    }

    insert(title: Title): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}`, {
            isActive: title.isActive,
            titleTranslations: title.modelTranslations
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    update(id: string, title: Title): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}${id}`, {
            concurrencyStamp: title.concurrencyStamp,
            isActive: title.isActive,
            titleTranslations: title.modelTranslations
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    delete(id: string): Observable<IActionResultResponse> {
        return this.http.delete(`${this.url}${id}`, {
            params: new HttpParams()
                .set('id', id.toString())
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }
}
