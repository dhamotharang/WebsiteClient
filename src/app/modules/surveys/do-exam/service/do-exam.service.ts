import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { SurveyUserAnswerModel } from '../viewmodels/survey-user-answer.model';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { ExamOverviewViewModel } from '../viewmodels/exam-overview.viewmodel';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { ExamDetailViewModel } from '../viewmodels/exam-detail.viewmodel';

export class DoExamService {
    url = 'survey-user-answers/';
    urlExam = 'exams/';

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private http: HttpClient) {

        this.url = `${appConfig.SURVEY_API_URL}${this.url}`;
        this.urlExam = `${appConfig.SURVEY_API_URL}${this.urlExam}`;
    }

    getOverviews(surveyId: string): Observable<ActionResultViewModel<ExamOverviewViewModel>> {
        return this.http.post(`${this.urlExam}overviews/${surveyId}`, {})
            .pipe(map((result: ActionResultViewModel<ExamOverviewViewModel>) => {
                return result;
            })) as Observable<IActionResultResponse<ExamOverviewViewModel>>;
    }

    finishExam(surveyId: string, surveyUserId: string, surveyUserAnswerTimeId: string): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.urlExam}finish-do-exam/${surveyId}/${surveyUserId}/${surveyUserAnswerTimeId}`, {})
            .pipe(
                finalize(() => this.spinnerService.hide()),
                map((result: ActionResultViewModel) => {
                    return result;
                })) as Observable<ActionResultViewModel>;
    }

// TODO: need refact to add response data.
    start(surveyId: string) {
        this.spinnerService.show();
        return this.http.get(`${this.urlExam}start/${surveyId}`)
            .pipe(finalize(() => this.spinnerService.hide()));
    }

    answer(userAnswer: SurveyUserAnswerModel): Observable<ActionResultViewModel> {
        this.spinnerService.show();
        return this.http.post(`${this.urlExam}answer`, {
            surveyId: userAnswer.surveyId,
            questionVersionId: userAnswer.questionVersionId,
            answerId: userAnswer.answerId,
            value: userAnswer.value,
            surveyUserAnswerId: userAnswer.surveyUserAnswerId,
        }).pipe(
            finalize(() => this.spinnerService.hide()),
            map((result: ActionResultViewModel) => {
                // this.toastr.success(result.message);
                return result;
            })) as Observable<ActionResultViewModel>;
    }

    getDetailExam(surveyId: string, surveyUserId: string, surveyUserAnswerTimeId: string, isManager: boolean)
        : Observable<ActionResultViewModel<ExamDetailViewModel>> {
        this.spinnerService.show();
        return this.http.get(`${this.urlExam}detail/${surveyId}/${surveyUserId}/${surveyUserAnswerTimeId}/manager/${isManager}`)
            .pipe(finalize(() => this.spinnerService.hide())) as Observable<ActionResultViewModel<ExamDetailViewModel>>;
    }
}
