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
import { QuestionGroupSearchViewModel } from '../viewmodels/question-group-search-viewmodel';
import { QuestionGroupDetailViewModel } from '../viewmodels/question-group-detail.viewmodel';
import { QuestionGroup } from '../models/question-group.model';
import { QuestionForSelectViewModel } from '../viewmodels/question-for-select.viewmodel';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { finalize } from 'rxjs/internal/operators';

export class QuestionGroupService implements Resolve<QuestionGroup> {
    url = 'question-groups/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private spinceService: SpinnerService,
                private http: HttpClient,
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
           pageSize: number = this.appConfig.PAGE_SIZE): Observable<ISearchResult<QuestionGroupSearchViewModel>> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('isActive', isActive !== null && isActive !== undefined ? isActive.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}`, {
            params: params
        }).pipe(map((result: ISearchResult<QuestionGroupSearchViewModel>) => {
            if (result.items) {
                result.items.forEach((item: QuestionGroupSearchViewModel) => {
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
        })) as Observable<ISearchResult<QuestionGroupSearchViewModel>>;
    }

    getDetail(id: number): Observable<ActionResultViewModel<QuestionGroupDetailViewModel>> {
        this.spinceService.show();
        return this.http.get(`${this.url}${id}`, {})
            .pipe(finalize(() => {
                this.spinceService.hide();
            }))as Observable <ActionResultViewModel< QuestionGroupDetailViewModel >>;
    }

    getAll(): Observable<ISearchResult<QuestionGroupSearchViewModel>> {
        return this.http.get(`${this.url}alls`).pipe(map((result: ISearchResult<QuestionGroupSearchViewModel>) => {
            result.items.forEach((item: QuestionGroupSearchViewModel) => {
                item.activeStatus = item.isActive
                    ? 'active'
                    : 'inActive';
            });
            return result;
        }))as Observable<ISearchResult<QuestionGroupSearchViewModel>>;
    }

    getTree(): Observable<TreeData[]> {
        return this.http.get(`${this.url}trees`) as Observable<TreeData[]>;
    }

    insert(questionGroup: QuestionGroup): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}`, {
            order: questionGroup.order,
            parentId: questionGroup.parentId,
            isActive: questionGroup.isActive,
            questionGroupTranslations: questionGroup.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    update(id: number, questionGroup: QuestionGroup): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${id}`, {
            order: questionGroup.order,
            parentId: questionGroup.parentId,
            isActive: questionGroup.isActive,
            concurrencyStamp: questionGroup.concurrencyStamp,
            questionGroupTranslations: questionGroup.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: number): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`, {
            params: new HttpParams()
                .set('id', id ? id.toString() : '')
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    searchForSelect(keyword: string, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE)
        : Observable<QuestionForSelectViewModel[]> {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());
        return this.http.get(`${this.url}sugesstions`, {
            params: params
        }) as Observable<QuestionForSelectViewModel[]>;
    }
}
