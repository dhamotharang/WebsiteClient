import { QuestionTranslation } from './question-translation.model';
import { Answer } from './answer.model';

export const QuestionType = {
    singleChoice: 0, // Một đáp án
    multiChoice: 1, // Nhiều đáp án
    vote: 2, // Đánh giá
    essay: 3, // Tự luận
    selfResponded: 4 // Tự trả lời
};

export const QuestionStatus = {
    draft: 0, // Nháp
    pending: 1, // Đang chờ
    approved: 2, // Đang duyệt
    decline: 3 // Hủy duyệt
};

export const QuestionAnswerStatus = {
    hasAnswer: 0,
    noAnswer: 1,
    all: 2,
    correct: 3,
    inCorrect: 4,
}

export class Question {
    questionGroupId: number;
    questionType: number;
    concurrencyStamp: string;
    score: number;
    totalAnswer: number;
    isActive: boolean;
    answers: Answer[];
    modelTranslations: QuestionTranslation[];
    constructor() {
        this.isActive = true;

    }
}
