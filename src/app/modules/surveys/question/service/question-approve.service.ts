import { ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { QuestionStatus, QuestionType } from '../models/question.model';
import { Observable } from 'rxjs';
import { QuestionSearchViewModel } from '../viewmodels/question-search.viewmodel';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { ChangeListQuestionStatusModel } from '../models/change-list-question-status.model';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';

export class QuestionApproveService {
    url = 'questions/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private http: HttpClient,
                private toastr: ToastrService) {
        this.url = `${appConfig.SURVEY_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.questionType,
            queryParams.questionGroupId,
            queryParams.creatorId,
            queryParams.questionStatus,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, questionType?: number, questionGroupId?: number, creatorId?: string,
           questionStatus?: number, page: number = 1, pageSize: number = this.appConfig.PAGE_SIZE) {
        const params = new HttpParams()
            .set('keyword', keyword ? keyword : '')
            .set('questionType', questionType !== undefined && questionType !== null ? questionType.toString() : '')
            .set('questionGroupId', questionGroupId !== undefined && questionGroupId !== null ? questionGroupId.toString() : '')
            .set('creatorId', creatorId ? creatorId : '')
            .set('questionStatus', questionStatus !== undefined && questionStatus !== null ? questionStatus.toString() : '')
            .set('page', page ? page.toString() : '1')
            .set('pageSize', pageSize ? pageSize.toString() : this.appConfig.PAGE_SIZE.toString());

        return this.http.get(`${this.url}approves`, {
            params: params
        }).pipe(map((result: ISearchResult<QuestionSearchViewModel>) => {
            if (result.items) {
                result.items.forEach((item: QuestionSearchViewModel) => {
                    item.isCheck = false;
                    item.statusName = item.questionStatus === QuestionStatus.draft ? 'Draft' :
                        item.questionStatus === QuestionStatus.pending ? 'Pending' :
                            item.questionStatus === QuestionStatus.approved ? 'Approved' :
                                item.questionStatus === QuestionStatus.decline ? 'Decline' : '';
                    item.typeName = item.questionType === QuestionType.singleChoice ? 'Single Choice' :
                        item.questionType === QuestionType.multiChoice ? 'Multi Choice' :
                            item.questionType === QuestionType.essay ? 'Essay' :
                                item.questionType === QuestionType.vote ? 'Vote' :
                                    item.questionType === QuestionType.selfResponded ? 'Self Responded' : '';
                });
            }
            return result;
        })) as Observable<ISearchResult<QuestionSearchViewModel>>;
    }

    updateStatus(versionId: string, questionStatus): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${versionId}/status/${questionStatus}`, {})
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateMultiStatus(listQuestionChangeStatus: ChangeListQuestionStatusModel): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}change-list-question-status`, {
            questionVersionIds: listQuestionChangeStatus.questionVersionIds,
            questionStatus: listQuestionChangeStatus.questionStatus,
            reason: listQuestionChangeStatus.reason,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }
}
