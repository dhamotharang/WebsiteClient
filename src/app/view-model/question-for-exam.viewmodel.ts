/**
 * Created by HoangNH on 12/22/2016.
 */
export class QuestionForExamViewModel {
    surveyId: number;
    questionId: number;
    questionName: string;
    questionType: number;
    questionOrder: number;
    answerId: number;
    answerName: string;
    answerOrder: number;
    point: number;
    isSelected: boolean;
    value: string;
    totalAnswer: number;

    constructor(surveyId?: number, questionId?: number, questionName?: string, questionType?: number, questionOrder?: number,
        answerId?: number, answerName?: string, answerOrder?: number, point?: number, isSelected?: boolean, value?: string, totalAnswer?: number) {
        this.surveyId = surveyId;
        this.questionId = questionId;
        this.questionName = questionName;
        this.questionType = questionType;
        this.questionOrder = questionOrder;
        this.answerId = answerId;
        this.answerName = answerName;
        this.answerOrder = answerOrder;
        this.point = point;
        this.isSelected = isSelected;
        this.value = value;
        this.totalAnswer = totalAnswer;
    }
}
