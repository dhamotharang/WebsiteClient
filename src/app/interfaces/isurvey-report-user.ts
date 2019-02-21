/**
 * Created by HoangNH on 5/11/2017.
 */
export interface ISurveyReportUser {
    userId: string;
    fullName: string;
    surveyId: number;
    isFinished: boolean;
    status: number;
    lateDays: number;
    useTime: number;
}
