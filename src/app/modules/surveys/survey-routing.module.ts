import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionGroupComponent } from './question-group/question-group.component';
import { QuestionGroupService } from './question-group/service/question-group.service';
import { SurveyGroupComponent } from './survey-group/survey-group.component';
import { SurveyGroupService } from './survey-group/services/survey-group.service';
import { QuestionComponent } from './question/question.component';
import { QuestionService } from './question/service/question.service';
import { DoExamComponent } from './do-exam/do-exam.component';
import { QuestionApproveComponent } from './question/question-approve/question-approve.component';
import { QuestionApproveService } from './question/service/question-approve.service';
import { SurveyService } from './survey/survey.service';
import { SurveyListComponent } from './survey/survey-list/survey-list.component';
import { PageQuestionDetailComponent } from './question/question-detail/page-question-detail.component';
import { QuestionDetailResolve } from './question/question-detail/question-detail.resolve';
import { DoExamResolve } from './do-exam/do-exam.resolve';
import { ExamOverviewComponent } from './do-exam/exam-overview/exam-overview.component';
import { ExamOverviewResolve } from './do-exam/exam-overview/exam-overview.resolve';
import { FinishComponent } from './do-exam/finish-exam/finish.component';
import { SurveyReportComponent } from './survey-report/survey-report.component';
import { SurveyReportService } from './survey-report/survey-report.service';
import { SurveyUserReportComponent } from './survey-report/survey-user-report/survey-user-report.component';
import { MySurveyComponent } from './my-survey/my-survey.component';

export const surveyRoutes: Routes = [
    {
        path: '',
        resolve: {
            data: SurveyService,
        },
        component: SurveyListComponent
    },
    {
        path: 'question-group',
        component: QuestionGroupComponent,
        resolve: {
            data: QuestionGroupService
        }
    }, {
        path: 'survey-group',
        component: SurveyGroupComponent,
        resolve: {
            data: SurveyGroupService
        }
    },
    {
        path: 'question',
        component: QuestionComponent,
        resolve: {
            searchResult: QuestionService
        }
    },
    {
        path: 'question-approve',
        component: QuestionApproveComponent,
        resolve: {
            searchResult: QuestionApproveService
        }
    },
    {
        path: 'question/:versionId',
        component: PageQuestionDetailComponent,
        resolve: {versionId: QuestionDetailResolve}
    },
    {
        path: 'overviews/:surveyId',
        component: ExamOverviewComponent,
        resolve: {
            data: ExamOverviewResolve
        }
    },
    {
        path: 'start/:id',
        component: DoExamComponent,
        resolve: {
            data: DoExamResolve
        }
    },
    {
        path: 'finish-exam',
        component: FinishComponent
    },
    {
        path: 'reports',
        component: SurveyReportComponent,
        resolve: {
            data: SurveyReportService
        }
    }, {
        path: 'reports/:id',
        component: SurveyUserReportComponent
    },
    {
        path: 'my-survey',
        component: MySurveyComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(surveyRoutes)],
    exports: [RouterModule],
    providers: [QuestionGroupService, SurveyGroupService, SurveyService,
        QuestionDetailResolve, DoExamResolve, ExamOverviewResolve, SurveyReportService]
})

export class SurveyRoutingModule {
}
