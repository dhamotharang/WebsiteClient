import { SurveyUserQuestionAnswerViewModel } from './survey-user-question-answer.viewmodel';

export class DoExamViewModel {
    officeName: string;
    positionName: string;
    surveyId: string;
    surveyUserId: string;
    surveyName: number;
    startTime?: Date;
    endTime?: Date;
    totalSeconds: number;
    surveyUserAnswerTimeId: string;
    surveyUserQuestionAnswers: SurveyUserQuestionAnswerViewModel[];
}
