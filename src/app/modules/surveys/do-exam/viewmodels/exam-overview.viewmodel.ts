import { SurveyUserAnswerTimeViewModel } from './survey-user-answer-time.viewmodel';

export class ExamOverviewViewModel {
    surveyId: string;
    surveyUserId: string;
    surveyName: string;
    totalQuestion: number;
    startDate: Date;
    endDate: Date;
    limitedTimes: number;
    limitedTime: number;
    surveyDescription: string;
    isRequired: boolean;
    surveyUserAnswerTimes: SurveyUserAnswerTimeViewModel[];
}
