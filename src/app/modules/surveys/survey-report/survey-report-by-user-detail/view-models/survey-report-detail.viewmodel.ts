import { SurveyUserAnswerTimesViewModel } from './survey-user-answer-times.viewmodel';

export interface SurveyReportDetailViewModel {
    surveyUserId: string;
    surveyId: string;
    userId: string;
    fullName: string;
    avatar: string;
    officeId: number;
    officeName: string;
    positionId: string;
    positionName: string;

    surveyUserAnswerTimes: SurveyUserAnswerTimesViewModel[];
}
