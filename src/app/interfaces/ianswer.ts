/**
 * Created by HoangNH on 5/21/2017.
 */
export interface IAnswer {
    id: number;
    name: string;
    // surveyId: number;
    // questionId: number;
    isCorrect?: boolean;
    value: string;
    order: number;
    isSelected: boolean;
}
