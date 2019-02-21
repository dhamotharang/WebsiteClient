import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
    MatButtonModule, MatCheckboxModule, MatIconModule, MatRadioModule, MatTooltipModule
} from '@angular/material';
import { NhSelectModule } from '../../shareds/components/nh-select/nh-select.module';
import { NHTreeModule } from '../../shareds/components/nh-tree/nh-tree.module';
import { NhModalModule } from '../../shareds/components/nh-modal/nh-modal.module';
import { DateTimeValidator } from '../../validators/datetime.validator';
import { NumberValidator } from '../../validators/number.validator';
import { QuestionGroupComponent } from './question-group/question-group.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { QuestionGroupFormComponent } from './question-group/question-group-form/question-group-form.component';
import { GhmPagingModule } from '../../shareds/components/ghm-paging/ghm-paging.module';
import { CoreModule } from '../../core/core.module';
import { SurveyRoutingModule } from './survey-routing.module';
import { SurveyGroupComponent } from './survey-group/survey-group.component';
import { SurveyGroupFormComponent } from './survey-group/survey-group-form/survey-group-form.component';
import { QuestionComponent } from './question/question.component';
import { QuestionFormComponent } from './question/question-form/question-form.component';
import { QuestionService } from './question/service/question.service';
import { GhmUserSuggestionModule } from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import { SurveyFormComponent } from './survey/survey-form/survey-form.component';
import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { NhDateModule } from '../../shareds/components/nh-datetime-picker/nh-date.module';
import { QuestionSelectComponent } from './question/question-select/question-select.component';
import { AnswerComponent } from './question/answer/answer.component';
import { QuestionDetailComponent } from './question/question-detail/question-detail.component';
import { DoExamComponent } from './do-exam/do-exam.component';
import { QuestionApproveComponent } from './question/question-approve/question-approve.component';
import { QuestionApproveService } from './question/service/question-approve.service';
import { PageQuestionDetailComponent } from './question/question-detail/page-question-detail.component';
import { DoExamService } from './do-exam/service/do-exam.service';
import { GhmSelectPickerModule } from '../../shareds/components/ghm-select-picker/ghm-select-picker.module';
import { NhUserPickerModule } from '../../shareds/components/nh-user-picker/nh-user-picker.module';
import { QuestionExplainDeclineReasonComponent } from './question/question-approve/question-explain-decline-reason.component';
import { ExamOverviewComponent } from './do-exam/exam-overview/exam-overview.component';
import { DatetimeFormatModule } from '../../shareds/pipe/datetime-format/datetime-format.module';
import { FinishComponent } from './do-exam/finish-exam/finish.component';
import { SurveyReportComponent } from './survey-report/survey-report.component';
import { SurveyUserReportComponent } from './survey-report/survey-user-report/survey-user-report.component';
import { SurveyReportByUserDetailComponent } from './survey-report/survey-report-by-user-detail/survey-report-by-user-detail.component';
import { ChartModule } from 'angular-highcharts';
import { SurveyReportUserAnswerTimesComponent } from './survey-report/survey-report-user-answer-times/survey-report-user-answer-times.component';
import { ExamDetailComponent } from './do-exam/exam-detail/exam-deatil.component';
import { MySurveyComponent } from './my-survey/my-survey.component';

@NgModule({
    imports: [FormsModule, SurveyRoutingModule, CommonModule, MatButtonModule, MatCheckboxModule, NhDateModule, MatRadioModule,
        NHTreeModule, NhSelectModule, ReactiveFormsModule, FormsModule, CoreModule, NhModalModule, GhmUserSuggestionModule,
        GhmSelectPickerModule, NhUserPickerModule, MatButtonModule, MatIconModule, GhmPagingModule, ChartModule,
        MatButtonModule, MatIconModule, GhmPagingModule, MatTooltipModule, DatetimeFormatModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary cm-mgr-5',
            cancelButtonClass: 'btn',
            confirmButtonText: 'Đồng ý',
            showCancelButton: true,
            cancelButtonText: 'Hủy bỏ'
        }),
    ],
    declarations: [QuestionGroupComponent, QuestionGroupFormComponent, SurveyGroupComponent, QuestionSelectComponent,
        SurveyGroupFormComponent, QuestionComponent, QuestionFormComponent, SurveyListComponent, SurveyFormComponent,
        QuestionDetailComponent, AnswerComponent, QuestionApproveComponent, DoExamComponent, PageQuestionDetailComponent,
        QuestionExplainDeclineReasonComponent, ExamOverviewComponent, FinishComponent, SurveyReportComponent, SurveyUserReportComponent,
        SurveyReportByUserDetailComponent, SurveyReportUserAnswerTimesComponent,
        QuestionExplainDeclineReasonComponent, ExamOverviewComponent, FinishComponent, ExamDetailComponent, MySurveyComponent,
        QuestionExplainDeclineReasonComponent, ExamOverviewComponent, FinishComponent, ExamDetailComponent,
        SurveyReportByUserDetailComponent, ExamDetailComponent],
    entryComponents: [],
    providers: [DateTimeValidator, NumberValidator, QuestionService,
        QuestionApproveService, DoExamService]
})

export class SurveyModule {
}
