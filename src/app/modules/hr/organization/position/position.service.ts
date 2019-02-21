import { Inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Position } from './position.model';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { PositionSearchViewModel } from './models/postion-search.viewmodel';
import { ToastrService } from 'ngx-toastr';
import { PositionDetailViewModel } from './models/position-detail.model';
import { TitleSearchForSelectViewModel } from '../title/title-search-for-select.viewmodel';
import { PositionSearchForSelectViewModel } from './models/posititonSearchForSelectViewModel';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { finalize } from 'rxjs/internal/operators';
import { NhSuggestion } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';

@Injectable()
export class PositionService implements Resolve<any> {
    url = 'positions/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {
        this.url = `${this.appConfig.HR_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object) {
        const queryParams = route.queryParams;
        return this.search(queryParams.keyword, queryParams.isManager, queryParams.isMultiple, queryParams.isActive,
            queryParams.page, queryParams.pageSize);
    }

    search(keyword: string, isManager?: boolean, isMultiple?: boolean, isActive?: boolean, page: number = 1,
           pageSize: number = 10): Observable<ISearchResult<PositionSearchViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('isManager', isManager !== undefined && isManager != null ? isManager.toString() : '')
                .set('isMultiple', isMultiple !== undefined && isMultiple != null ? isMultiple.toString() : '')
                .set('isActive', isActive !== undefined && isActive != null ? isActive.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString())
        }) as Observable<ISearchResult<PositionSearchViewModel>>;
    }

    searchForSuggestion(keyword: string): Observable<NhSuggestion[]> {
        return this.http.get(`${this.url}suggestions`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
        }) as Observable<NhSuggestion[]>;
    }

    getAll(): Observable<any> {
        return this.http.get(`${this.url}`);
    }

    getDetail(id: string): Observable<IActionResultResponse<PositionDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${id}`)
            .pipe(finalize(() => this.spinnerService.hide()))as Observable<IActionResultResponse<PositionDetailViewModel>>;
    }

    insert(position: Position, officeIds: number[]): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}`, {
            isManager: position.isManager,
            isMultiple: position.isMultiple,
            isActive: position.isActive,
            titleId: position.titleId,
            positionTranslations: position.modelTranslations,
            officeIds: officeIds
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    update(position: Position, officeIds: number[]): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}${position.id}`, {
            isManager: position.isManager,
            isMultiple: position.isMultiple,
            isActive: position.isActive,
            titleId: position.titleId,
            concurrencyStamp: position.concurrencyStamp,
            positionTranslations: position.modelTranslations,
            officeIds: officeIds
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    delete(id: string): Observable<IActionResultResponse> {
        return this.http.delete(`${this.url}${id}`).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    getTitleByPositionId(id: string): Observable<IActionResultResponse<TitleSearchForSelectViewModel>> {
        return this.http.get(`${this.url}titles/${id}`) as Observable<IActionResultResponse<TitleSearchForSelectViewModel>>;
    }

    getAllActivated(): Observable<PositionSearchForSelectViewModel[]> {
        return this.http.get(`${this.url}activated`) as Observable<PositionSearchForSelectViewModel[]>;
    }
}
