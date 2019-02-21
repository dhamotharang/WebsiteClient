import { SurveyUserQuestionAnswerDetailViewModel } from './survey-user-question-answer-detail.viewmodel';

export class ExamDetailViewModel {
    fullName: string;
    avatar: string;
    surveyName: string;
    totalSeconds: string;
    startTime: Date;
    endTime: Date;
    officeName: string;
    positionName: string;
    totalCorrectAnswers: number;
    isViewResult: boolean;
    surveyUserQuestionAnswerDetails: SurveyUserQuestionAnswerDetailViewModel[];
}
