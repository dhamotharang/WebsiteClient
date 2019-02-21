/**
 * Created by HoangNH on 5/11/2017.
 */
export interface ISurveyReportResult {
    surveyId: number;
    surveyName: string;
    totalUserJoined: number;
    totalFinished: number;
    totalPassed: number;
    totalFailed: number;
    passedPercent: number;
    failedPercent: number;
    totalUser: number;
}
