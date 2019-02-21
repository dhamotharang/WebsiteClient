import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SurveyViewModel } from './survey-list/survey.viewmodel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { Survey } from './survey.model';
import { ToastrService } from 'ngx-toastr';
import { SurveyDetailResultViewModel, SurveyDetailViewModel } from './survey-detail.viewmodel';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class SurveyService implements Resolve<SurveyViewModel> {
    url = 'surveys/';

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private http: HttpClient) {
        this.url = `${appConfig.SURVEY_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.groupId,
            queryParams.isActive,
            queryParams.startDate,
            queryParams.endDate,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, surveyGroupId?: number, isActive?: boolean, startDate?: string, endDate?: string,
           page = 1, pageSize = 10): Observable<SearchResultViewModel<SurveyViewModel>> {
        return this.http.get(`${this.url}`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('surveyGroupId', surveyGroupId ? surveyGroupId.toString() : '')
                .set('isActive', isActive != null && isActive !== undefined ? isActive.toString() : '')
                .set('startDate', startDate ? startDate : '')
                .set('endDate', endDate ? endDate : '')
                .set('page', page ? page.toString() : '')
                .set('pageSize', pageSize ? pageSize.toString() : '')
        }) as Observable<SearchResultViewModel<SurveyViewModel>>;
    }

    insert(survey: Survey, questions: any, questionGroups: any, users: any): Observable<ActionResultViewModel> {
        return this.http
            .post(`${this.url}`, {
                surveyGroupId: survey.surveyGroupId,
                isPublishOutside: survey.isPublishOutside,
                isActive: survey.isActive,
                isRequire: survey.isRequire,
                totalQuestion: survey.totalQuestion,
                limitedTimes: survey.limitedTimes,
                limitedTime: survey.limitedTime,
                status: survey.status,
                concurrencyStamp: survey.concurrencyStamp,
                startDate: survey.startDate,
                endDate: survey.endDate,
                type: survey.type,
                isPreRendering: survey.isPreRendering,
                surveyTranslations: survey.modelTranslations,
                questions: questions.map((question: any) => {
                    return question.id;
                }),
                questionGroups: questionGroups.map((questionGroup: any) => {
                    return {
                        questionGroupId: questionGroup.id,
                        totalQuestion: questionGroup.totalQuestion
                    };
                }),
                users: users.map((user: any) => {
                    return user.id;
                })
            })
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            }));
    }

    update(id: string, survey: Survey, questions: any, questionGroups: any, users: any): Observable<ActionResultViewModel> {
        return this.http
            .post(`${this.url}${id}`, {
                surveyGroupId: survey.surveyGroupId,
                isPublishOutside: survey.isPublishOutside,
                isActive: survey.isActive,
                isRequire: survey.isRequire,
                totalQuestion: survey.totalQuestion,
                limitedTimes: survey.limitedTimes,
                limitedTime: survey.limitedTime,
                status: survey.status,
                concurrencyStamp: survey.concurrencyStamp,
                startDate: survey.startDate,
                endDate: survey.endDate,
                type: survey.type,
                isPreRendering: survey.isPreRendering,
                surveyTranslations: survey.modelTranslations,
                questions: questions.map((question: any) => {
                    return question.id;
                }),
                questionGroups: questionGroups.map((questionGroup: any) => {
                    return {
                        questionGroupId: questionGroup.id,
                        totalQuestion: questionGroup.totalQuestion
                    };
                }),
                users: users.map((user: any) => {
                    return user.id;
                })
            })
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            }));
    }

    updateQuestions(id: string, questions: any, questionGroups: any): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}${id}/questions`, {
                questions: questions.map((question: any) => {
                    return question.id;
                }),
                questionGroups: questionGroups.map((questionGroup: any) => {
                    return {
                        questionGroupId: questionGroup.id,
                        totalQuestion: questionGroup.totalQuestion
                    };
                })
            })
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                }));
    }

    updateUser(id: string, users: any): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http
            .post(`${this.url}${id}/users`, users.map((user: any) => {
                return user.id;
            }))
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    return result;
                }));
    }

    delete(id: string): Observable<ActionResultViewModel> {
        return this.http.delete(`${this.url}${id}`)
            .pipe(map((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                return result;
            }));
    }

    detail(id: string): Observable<SurveyDetailViewModel> {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}${id}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<SurveyDetailResultViewModel>) => {
                    const surveyDetailResult = result.data;
                    const surveyDetail: SurveyDetailViewModel = {
                        id: surveyDetailResult.id,
                        isActive: surveyDetailResult.isActive,
                        isRequire: surveyDetailResult.isRequire,
                        isPreRendering: surveyDetailResult.isPreRendering,
                        totalQuestion: surveyDetailResult.totalQuestion,
                        limitedTimes: surveyDetailResult.limitedTimes,
                        limitedTime: surveyDetailResult.limitedTime,
                        concurrencyStamp: surveyDetailResult.concurrencyStamp,
                        startDate: surveyDetailResult.startDate,
                        endDate: surveyDetailResult.endDate,
                        surveyTranslations: surveyDetailResult.surveyTranslations,
                        surveyGroupId: surveyDetailResult.surveyGroupId,
                        users: [],
                        questions: [],
                        questionGroups: []
                    };
                    surveyDetail.users = surveyDetailResult.users.map((user: any) => {
                        return {
                            id: user.userId,
                            fullName: user.fullName,
                            avatar: user.avatar,
                            description: `${user.officeName} - ${user.positionName}`,
                            isSelected: true
                        };
                    });
                    surveyDetail.questions = surveyDetailResult.questions.map((question: any) => {
                        return {
                            id: question.questionVersionId,
                            name: question.questionName
                        };
                    });
                    surveyDetail.questions = surveyDetailResult.questions.map((question: any) => {
                        return {
                            id: question.questionVersionId,
                            name: question.questionName
                        };
                    });
                    surveyDetail.questionGroups = surveyDetailResult.questionGroups.map((questionGroup: any) => {
                        return {
                            id: questionGroup.questionGroupId,
                            name: questionGroup.questionGroupName,
                            totalQuestion: questionGroup.totalQuestion
                        };
                    });
                    return surveyDetail;
                })
            ) as Observable<SurveyDetailViewModel>;
    }
}
