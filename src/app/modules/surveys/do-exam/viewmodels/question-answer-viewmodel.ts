import { AnswerViewModel } from '../../question/viewmodels/answer.viewmodel';

export class QuestionAnswerViewModel {
    versionId: string;
    name: string;
    content: string;
    explain: string;
    questionType: number;
    score: number;
    totalAnswer;
    isAnswer: boolean;
    order: number;
    orderAnswerSelect: number;
    isCorrect: boolean;
    answers: AnswerViewModel[];
}
