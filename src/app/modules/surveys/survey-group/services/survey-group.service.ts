import { ToastrService } from 'ngx-toastr';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject } from '@angular/core';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { TreeData } from '../../../../view-model/tree-data';
import { SurveyGroupSearchViewModel } from '../viewmodels/survey-group-search.viewmodel';
import { SurveyGroupDetailViewModel } from '../viewmodels/survey-group-detail.viewmodel';
import { SurveyGroup } from '../models/survey-group.model';
import { SurveyGroupSearchForSelectViewModel } from '../viewmodels/survey-group-search-for-select.viewmodel';
import { SpinnerService } from '../../../../core/spinner/spinner.service';

export class SurveyGroupService {
    url = 'survey-groups/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient,
                private spinnerService: SpinnerService,
                private toastr: ToastrService) {
        this.url = `${appConfig.SURVEY_API_URL}${this.url}`;
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
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<ISearchResult<SurveyGroupSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }).pipe(map((result: ISearchResult<SurveyGroupSearchViewModel>) => {
            if (result.items) {
                result.items.forEach((item: SurveyGroupSearchViewModel) => {
                    item.activeStatus = item.isActive
                        ? 'active'
                        : 'inActive';
                    const level = item.idPath.split('.');
                    item.nameLevel = '';
                    for (let i = 1; i < level.length; i++) {
                        item.nameLevel += '<i class="fa fa-long-arrow-right cm-mgr-5"></i>';
                    }
                });
            }
            return result;
        })) as Observable<ISearchResult<SurveyGroupSearchViewModel>>;
    }

    getDetail(id: number): Observable<IActionResultResponse<SurveyGroupDetailViewModel>> {
        return this.http.get(`${this.url}${id}`, {})as Observable<IActionResultResponse<SurveyGroupDetailViewModel>>;
    }

    getAll(): Observable<ISearchResult<SurveyGroupSearchViewModel>> {
        return this.http.get(`${this.url}alls`).pipe(map((result: ISearchResult<SurveyGroupSearchViewModel>) => {
            result.items.forEach((item: SurveyGroupSearchViewModel) => {
                item.activeStatus = item.isActive
                    ? 'active'
                    : 'inActive';
            });
            return result;
        }))as Observable<ISearchResult<SurveyGroupSearchViewModel>>;
    }

    getTree(): Observable<TreeData[]> {
        return this.http.get(`${this.url}trees`) as Observable<TreeData[]>;
    }

    insert(surveyGroup: SurveyGroup): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}`, {
            order: surveyGroup.order,
            parentId: surveyGroup.parentId,
            isActive: surveyGroup.isActive,
            surveyGroupTranslations: surveyGroup.modelTranslations,
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    update(id: number, surveyGroup: SurveyGroup): Observable<IActionResultResponse> {
        return this.http.post(`${this.url}${id}`, {
            order: surveyGroup.order,
            parentId: surveyGroup.parentId,
            isActive: surveyGroup.isActive,
            concurrencyStamp: surveyGroup.concurrencyStamp,
            surveyGroupTranslations: surveyGroup.modelTranslations,
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    delete(id: number): Observable<IActionResultResponse> {
        return this.http.delete(`${this.url}${id}`, {
            params: new HttpParams()
                .set('id', id ? id.toString() : '')
        }).pipe(map((result: IActionResultResponse) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<IActionResultResponse>;
    }

    searchForSelect(keyword: string, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE)
        : Observable<SurveyGroupSearchForSelectViewModel[]> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());
        return this.http.get(`${this.url}sugesstions`, {
            params: params
        }) as Observable<SurveyGroupSearchForSelectViewModel[]>;
    }
}
