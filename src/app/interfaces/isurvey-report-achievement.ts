/**
 * Created by HoangNH on 5/12/2017.
 */
export interface ISurveyReportAchievement {
    surveyId: number;
    surveyUserId: number;
    surveyName: string;
    userId: string;
    fullName: string;
    image: string;
    totalTime?: number;
    postTime?: number;
    totalCorrectAnswer?: number;
    totalPoint?: number;
}
