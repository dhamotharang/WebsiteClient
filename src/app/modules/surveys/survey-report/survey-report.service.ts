///<reference path="survey-report-by-user-detail/view-models/survey-user-answer-times.viewmodel.ts"/>
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { SurveyReportViewModel } from './view-models/survey-report.viewmodel';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { SurveyReportByUserDetailViewModel } from './view-models/survey-report-by-user-detail.viewmodel';
import { SurveyUsersReportViewModel } from './survey-user-report/survey-users-report.viewmodel';
import { SurveyReportDetailViewModel } from './survey-report-by-user-detail/view-models/survey-report-detail.viewmodel';
import { SurveyUserAnswerTimesViewModel } from './survey-report-by-user-detail/view-models/survey-user-answer-times.viewmodel';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { QuestionGroupReportViewModel } from './survey-report-by-user-detail/view-models/question-group-report.viewmodel';
import { SurveyUserReportVewModel } from '../my-survey/survey-user-report.vewmodel';

@Injectable()
export class SurveyReportService implements Resolve<SearchResultViewModel<SurveyReportViewModel>> {
    url = 'reports/';

    constructor(@Inject(APP_CONFIG) appConfig: IAppConfig,
                private http: HttpClient,
                private spinnerService: SpinnerService) {
        this.url = `${appConfig.SURVEY_API_URL}${this.url}`;
    }

    resolve(route: ActivatedRouteSnapshot, state: Object): any {
        const queryParams = route.queryParams;
        return this.search(
            queryParams.keyword,
            queryParams.surveyGroupId,
            queryParams.startDate,
            queryParams.endDate,
            queryParams.page,
            queryParams.pageSize
        );
    }

    search(keyword: string, surveyGroupId?: number, startDate?: string, endDate?: string,
           page = 1, pageSize = 10): Observable<SearchResultViewModel<SurveyReportViewModel>> {
        return this.http.get(this.url, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('surveyGroupId', surveyGroupId ? surveyGroupId.toString() : '')
                .set('startDate', startDate ? startDate.toString() : '')
                .set('endDate', endDate ? endDate.toString() : '')
                .set('page', page ? page.toString() : '')
                .set('pageSize', pageSize ? pageSize.toString() : '')
        }) as Observable<SearchResultViewModel<SurveyReportViewModel>>;
    }

    detail(surveyId: string): Observable<ActionResultViewModel<SurveyReportDetailViewModel>> {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}${surveyId}`)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<SurveyReportDetailViewModel>>;
    }

    getUserReport(surveyId: string, keyword: string, page: number,
                  pageSize: number): Observable<SearchResultViewModel<SurveyUsersReportViewModel>> {
        return this.http
            .get(`${this.url}${surveyId}/users`, {
                params: new HttpParams()
                    .set('keyword', keyword ? keyword.toString() : '')
                    .set('page', page ? page.toString() : '')
                    .set('pageSize', pageSize ? pageSize.toString() : '')
            })
            .pipe(map((result: SearchResultViewModel<SurveyUsersReportViewModel>) => {
                if (result.items) {
                    result.items.forEach((surveyUserReport: SurveyUsersReportViewModel) => {
                        surveyUserReport.totalMinutes = (surveyUserReport.totalSeconds / 60).toFixed(2);
                    });
                }
                return result;
            })) as Observable<SearchResultViewModel<SurveyUsersReportViewModel>>;
    }

    getSurveyUserReportDetail(surveyId: string, surveyUserId: string): Observable<SurveyReportDetailViewModel> {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}/${surveyId}/${surveyUserId}`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel<SurveyReportDetailViewModel>) => {
                    const data = result.data;
                    if (data.surveyUserAnswerTimes) {
                        data.surveyUserAnswerTimes.forEach((surveyUserAnswerTime: SurveyUserAnswerTimesViewModel) => {
                            surveyUserAnswerTime.totalMinutes = (surveyUserAnswerTime.totalSeconds / 60).toFixed(2);
                        });
                    }
                    return data;
                })) as Observable<SurveyReportDetailViewModel>;
    }

    getUserDetailReport(surveyId: string, surveyUserId: string): Observable<SearchResultViewModel<SurveyReportByUserDetailViewModel>> {
        return this.http.get(`${this.url}${surveyId}/users/${surveyUserId}`) as Observable<SearchResultViewModel<SurveyReportByUserDetailViewModel>>;
    }

    getReportByUserGroup(surveyId: string, surveyUserId: string): Observable<ActionResultViewModel<SurveyReportByUserDetailViewModel>> {
        return this.http.get(`${this.url}${surveyId}/users/${surveyUserId}/groups`) as  Observable<ActionResultViewModel<SurveyReportByUserDetailViewModel>>;
    }

    getQuestionGroupReport(surveyId: string, surveyUserAnswerTimeId: string): Observable<QuestionGroupReportViewModel[]> {
        this.spinnerService.show();
        return this.http
            .get(`${this.url}/${surveyId}/${surveyUserAnswerTimeId}/question-groups`)
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: SearchResultViewModel<QuestionGroupReportViewModel>) => {
                    const items = result.items;
                    return items;
                })
            ) as Observable<QuestionGroupReportViewModel[]>;
    }

    getSurveyByUserId(keyword: string, surveyGroupId?: number, startDate?: string, endDate?: string,
                      page = 1, pageSize = 10): Observable<SearchResultViewModel<SurveyUserReportVewModel>> {
        return this.http.get(`${this.url}users`, {
            params: new HttpParams()
                .set('keyword', keyword ? keyword : '')
                .set('surveyGroupId', surveyGroupId ? surveyGroupId.toString() : '')
                .set('startDate', startDate ? startDate.toString() : '')
                .set('endDate', endDate ? endDate.toString() : '')
                .set('page', page ? page.toString() : '')
                .set('pageSize', pageSize ? pageSize.toString() : '')
        }) as Observable<SearchResultViewModel<SurveyUserReportVewModel>>;
    }
}
