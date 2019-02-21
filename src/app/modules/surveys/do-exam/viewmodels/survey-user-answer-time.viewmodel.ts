export class SurveyUserAnswerTimeViewModel {
    id: string;
    surveyId: string;
    surveyUserId: string;
    fullName: string;
    questionNumber: number;
    questionNumberAnswer: number;
    questionNumberCorrect: number;
    startTime: Date;
    endTime: Date;
    times: number;
    totalTimes: number;
}
