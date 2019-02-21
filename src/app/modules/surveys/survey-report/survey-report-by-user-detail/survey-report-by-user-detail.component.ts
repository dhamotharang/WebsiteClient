import { Component, OnInit, ViewChild } from '@angular/core';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { Chart } from 'angular-highcharts';
import { SurveyReportService } from '../survey-report.service';
import { QuestionGroupReportViewModel } from './view-models/question-group-report.viewmodel';
import { ExamDetailComponent } from '../../do-exam/exam-detail/exam-deatil.component';

@Component({
    selector: 'app-survey-report-by-user-detail',
    templateUrl: './survey-report-by-user-detail.component.html'
})

export class SurveyReportByUserDetailComponent implements OnInit {
    @ViewChild('surveyUserReportByGroupModal') surveyUserReportByGroupModal: NhModalComponent;
    @ViewChild(ExamDetailComponent) examDetailComponent: ExamDetailComponent;
    // reportDetail: SurveyReportDetailViewModel;
    listQuestionGroups: QuestionGroupReportViewModel[] = [];
    surveyId: string;
    surveyUserId: string;
    surveyUserAnswerTimesId: string;
    groupChart: any;

    viewType = 0;
    tabType = 0;

    constructor(private surveyReportService: SurveyReportService) {
    }

    ngOnInit() {
    }

    show(surveyId: string, surveyUserId: string, surveyUserAnswerTimesId: string) {
        this.tabType = 0;
        this.surveyUserReportByGroupModal.open();
        this.surveyId = surveyId;
        this.surveyUserId = surveyUserId;
        this.surveyUserAnswerTimesId = surveyUserAnswerTimesId;
        this.examDetailComponent.showExamDetail(surveyId, surveyUserId, surveyUserAnswerTimesId);
        // this.surveyReportService.getSurveyUserReportDetail(surveyId, surveyUserId)
        //     .subscribe((result: SurveyReportDetailViewModel) => {
        //         this.reportDetail = result;
        //     });
    }

    changeView(viewType: number) {
        if (this.viewType === viewType) {
            return;
        }
        this.viewType = viewType;
        if (this.viewType === 1) {
            const series = this.listQuestionGroups.map((questionGroup: QuestionGroupReportViewModel) => {
                return {
                    name: questionGroup.questionGroupName,
                    data: []
                };
            });
            this.groupChart = new Chart({
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Report by question group'
                },
                xAxis: {
                    categories: this.listQuestionGroups.map((questionGroup: QuestionGroupReportViewModel) => {
                        return questionGroup.questionGroupName;
                    })
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Survey question group'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white'
                        }
                    }
                },
                series: [{
                    name: 'John',
                    data: [5, 3, 4, 7, 2]
                }, {
                    name: 'Jane',
                    data: [2, 2, 3, 2, 1]
                }, {
                    name: 'Joe',
                    data: [3, 4, 4, 2, 5]
                }]
            });
        }
    }

    changeTab(tabType: number) {
        if (this.tabType === tabType) {
            return;
        }

        this.tabType = tabType;
        if (this.tabType === 1) {
            this.surveyReportService.getQuestionGroupReport(this.surveyId, this.surveyUserAnswerTimesId)
                .subscribe((result: QuestionGroupReportViewModel[]) => {
                    this.listQuestionGroups = result;
                });
        }
    }
}
