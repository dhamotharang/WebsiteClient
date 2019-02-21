export interface SurveyUsersReportViewModel {
    surveyId: string;
    surveyUserId: string;
    userId: string;
    fullName: string;
    avatar: string;
    officeName: string;
    positionName: string;
    totalQuestions: number;
    totalUserAnswers: number;
    totalCorrectAnswers: number;
    totalTimes?: number;
    totalSeconds: number;
    totalMinutes: string;
}
