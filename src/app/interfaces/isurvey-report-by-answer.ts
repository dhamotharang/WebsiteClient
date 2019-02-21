/**
 * Created by HoangNH on 5/13/2017.
 */
export interface ISurveyReportByAnswerAnswer {
    answerId: number;
    answerName: string;
    totalSelected: number;
    isCorrect: boolean;
    percent: number;
}

export interface ISurveyReportByAnswerQuestion {
    questionId: number;
    questionName: string;
    isDelete: boolean;
    listAnswer: ISurveyReportByAnswerAnswer[],
    pieData: any;
}
