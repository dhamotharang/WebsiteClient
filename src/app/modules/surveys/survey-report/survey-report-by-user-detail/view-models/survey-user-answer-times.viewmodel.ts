export interface SurveyUserAnswerTimesViewModel {
    id: string;
    surveyId: string;
    startTime: string;
    endTime: string;
    totalUserAnswers: number;
    totalCorrectAnswers: number;
    totalCorrectScores: number;
    totalScores: number;
    totalSeconds: number;
    totalMinutes: string;
    totalQuestions: number;
    isViewResult: boolean;
}
