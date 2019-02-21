import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { ToastrService } from 'ngx-toastr';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inject } from '@angular/core';
import { Question, QuestionStatus, QuestionType } from '../models/question.model';
import { QuestionSearchViewModel } from '../viewmodels/question-search.viewmodel';
import { QuestionDetailViewModel } from '../viewmodels/question-detail.viewmodel';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { SuggestionViewModel } from '../../../../shareds/view-models/SuggestionViewModel';
import { ChangeListQuestionStatusModel } from '../models/change-list-question-status.model';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { finalize } from 'rxjs/internal/operators';

export class QuestionService implements Resolve<Question> {
    url = 'questions/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private spinnerService: SpinnerService,
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

        return this.http.get(`${this.url}`, {
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

    insert(isSend: boolean, question: Question): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}isSend/${isSend}`, {
            questionGroupId: question.questionGroupId,
            questionType: question.questionType,
            score: question.score,
            totalAnswer: question.totalAnswer,
            isActive: question.isActive,
            answers: question.answers,
            questionTranslations: question.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`, {
            params: new HttpParams()
                .set('id', id ? id.toString() : '')
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    getDetail(versionId: string): Observable<ActionResultViewModel<QuestionDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.url}${versionId}`, {})
            .pipe(
                finalize(() => this.spinnerService.hide())
            )as Observable<ActionResultViewModel<QuestionDetailViewModel>>;
    }

    update(isSend: boolean, questionId: string, versionId: string, question: Question): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}${versionId}/${questionId}/isSend/${isSend}`, {
            questionGroupId: question.questionGroupId,
            questionType: question.questionType,
            score: question.score,
            totalAnswer: question.totalAnswer,
            isActive: question.isActive,
            answers: question.answers,
            concurrencyStamp: question.concurrencyStamp,
            questionTranslations: question.modelTranslations,
        }).pipe(map((result: ActionResultViewModel) => {
            this.toastr.success(result.message);
            return result;
        })) as Observable<ActionResultViewModel>;
    }

    deleteMultiQuestion(versionIds: string[]): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}deletes`, versionIds)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    updateStatus(versionId: string, questionStatus: number, declineReason: string): Observable<ActionResultViewModel> {
        return this.http.post(`${this.url}/${versionId}/status/${questionStatus}`, '', {
            params: new HttpParams()
                .set('reason', declineReason)
        }).pipe(map((result: ActionResultViewModel) => {
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

    searchForSuggestion(keyword: string, questionGroupId?: number, page = 1,
                        pageSize = 10): Observable<SearchResultViewModel<SuggestionViewModel<string>>> {
        return this.http.get(`${this.url}suggestions`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('questionGroupId', questionGroupId ? questionGroupId.toString() : '')
                .set('page', page ? page.toString() : '1')
                .set('pageSize', pageSize ? pageSize.toString() : '10')
        }) as Observable<SearchResultViewModel<SuggestionViewModel<string>>>;
    }
}
